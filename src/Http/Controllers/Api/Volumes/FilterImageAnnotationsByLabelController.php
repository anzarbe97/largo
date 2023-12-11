<?php

namespace Biigle\Modules\Largo\Http\Controllers\Api\Volumes;

use Biigle\Volume;
use Biigle\ImageAnnotation;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Biigle\Http\Controllers\Api\Controller;

class FilterImageAnnotationsByLabelController extends Controller
{
    /**
     * Show all image annotations of the volume that have a specific label attached.
     *
     * @api {get} volumes/:vid/image-annotations/filter/label/:lid Get image annotations with a label
     * @apiGroup Volumes
     * @apiName ShowVolumesImageAnnotationsFilterLabels
     * @apiParam {Number} vid The volume ID
     * @apiParam {Number} lid The Label ID
     * @apiParam (Optional arguments) {Number} take Number of image annotations to return. If this parameter is present, the most recent annotations will be returned first. Default is unlimited.
     * @apiPermission projectMember
     * @apiDescription Returns a map of image annotation IDs to their image UUIDs. If there is an active annotation session, annotations hidden by the session are not returned. Only available for image volumes.
     *
     * @param Request $request
     * @param  int  $vid Volume ID
     * @param int $lid Label ID
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, $vid, $lid)
    {
        $volume = Volume::findOrFail($vid);
        $this->authorize('access', $volume);
        $this->validate($request, ['take' => 'integer']);
        $take = $request->input('take');

        $session = $volume->getActiveAnnotationSession($request->user());

        if ($session) {
            $query = ImageAnnotation::allowedBySession($session, $request->user());
        } else {
            $query = ImageAnnotation::query();
        }

        $res = $query->join('image_annotation_labels', 'image_annotations.id', '=', 'image_annotation_labels.annotation_id')
            ->join('images', 'image_annotations.image_id', '=', 'images.id')
            ->where('images.volume_id', $vid)
            ->where('image_annotation_labels.label_id', $lid)
            ->when($session, function ($query) use ($session, $request) {
                if ($session->hide_other_users_annotations) {
                    $query->where('image_annotation_labels.user_id', $request->user()->id);
                }
            })
            ->when(!is_null($take), function ($query) use ($take) {
                return $query->take($take);
            })
            ->select('images.uuid', 'image_annotations.id')
            ->distinct()
            ->orderBy('image_annotations.id', 'desc')
            ->pluck('images.uuid', 'image_annotations.id');

        $uuids = $res->values()->unique()->all();
        $annotationIds = $res->keys();

        // read all file paths from storage
        $allFilePaths = array_map(fn($uuid) => Storage::disk(config('largo.patch_storage_disk'))->files(fragment_uuid_path($uuid)), $uuids);
        $allFilePaths = Arr::flatten($allFilePaths);

        if (sizeof($allFilePaths) === 0) {
            // return object of arrays to maintain consistency
            foreach ($annotationIds as $id) {
                $res[$id] = [$res[$id]];
            }
            return $res;
        }

        // filter requested annotation svgs
        $filePaths = Arr::where($allFilePaths, fn($path) => $annotationIds->contains((Str::of($path))
            ->match('/([0-9]*).' . config('largo.annotation_format') . '/')
            ->toInteger()));

        foreach ($filePaths as $path) {
            $id = (Str::of($path))->match('/([0-9]*)\./')->toInteger();
            $uuid = $res[$id];
            $xml = Storage::disk(config('largo.patch_storage_disk'))->get($path);
            $res[$id] = [$uuid, $xml];
        }

        return $res;
    }
}
