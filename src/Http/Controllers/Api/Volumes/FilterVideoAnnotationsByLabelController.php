<?php

namespace Biigle\Modules\Largo\Http\Controllers\Api\Volumes;

use Biigle\Volume;
use Biigle\VideoAnnotation;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Biigle\Http\Controllers\Api\Controller;

class FilterVideoAnnotationsByLabelController extends Controller
{
    /**
     * Show all video annotations of the volume that have a specific label attached.
     *
     * @api {get} volumes/:vid/video-annotations/filter/label/:lid Get video annotations with a label
     * @apiGroup Volumes
     * @apiName ShowVolumesVideoAnnotationsFilterLabels
     * @apiParam {Number} vid The volume ID
     * @apiParam {Number} lid The Label ID
     * @apiParam (Optional arguments) {Number} take Number of video annotations to return. If this parameter is present, the most recent annotations will be returned first. Default is unlimited.
     * @apiPermission projectMember
     * @apiDescription Returns a map of video annotation IDs to their video UUIDs. If there is an active annotation session, annotations hidden by the session are not returned. Only available for video volumes.
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
            $query = VideoAnnotation::allowedBySession($session, $request->user());
        } else {
            $query = VideoAnnotation::query();
        }

        $res = $query->join('video_annotation_labels', 'video_annotations.id', '=', 'video_annotation_labels.annotation_id')
            ->join('videos', 'video_annotations.video_id', '=', 'videos.id')
            ->where('videos.volume_id', $vid)
            ->where('video_annotation_labels.label_id', $lid)
            ->when($session, function ($query) use ($session, $request) {
                if ($session->hide_other_users_annotations) {
                    $query->where('video_annotation_labels.user_id', $request->user()->id);
                }
            })
            ->when(!is_null($take), function ($query) use ($take) {
                return $query->take($take);
            })
            ->select('videos.uuid', 'video_annotations.id')
            ->distinct()
            ->orderBy('video_annotations.id', 'desc')
            ->pluck('videos.uuid', 'video_annotations.id');

        $uuids = $res->values()->unique()->all();
        $annotationIds = $res->keys();

        // read all file paths from storage
        $allFilePaths = array_map(fn($uuid) => Storage::disk(config('largo.patch_storage_disk'))->files(fragment_uuid_path($uuid)),$uuids);
        $allFilePaths = Arr::flatten($allFilePaths);

        if(sizeof($allFilePaths) === 0){
            // return object of arrays to maintain consistency
            foreach($annotationIds as $id){
                $res[$id] = [$res[$id]];
            }
            return $res;
        }

        // filter requested annotation svgs
        $filePaths = Arr::where($allFilePaths, fn($path) => $annotationIds->contains((Str::of($path))
                                                            ->match('/([0-9]*).'.config('largo.annotation_format').'/')
                                                            ->toInteger()));

        // group file paths by annotation id
        $id2paths = [];
        foreach($filePaths as $path){
            $id = (Str::of($path))->match('/([0-9]*)\./')->toInteger();
            $id2paths[$id] = $path;
        }

        // handle whole frame video annotations without svgs
        foreach($annotationIds as $id){
            $uuid = $res[$id];
            if(array_key_exists($id, $id2paths)) {
                $xml = Storage::disk(config('largo.patch_storage_disk'))->get($id2paths[$id]);
                $res[$id] = [$uuid,$xml];
            } else {
                $res[$id] = [$uuid];
            }
        }

        return $res;
    }
}
