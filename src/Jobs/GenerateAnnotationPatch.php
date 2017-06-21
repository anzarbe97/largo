<?php

namespace Biigle\Modules\Largo\Jobs;

use App;
use File;
use Biigle\Shape;
use Biigle\Jobs\Job;
use Biigle\Annotation;
use InterventionImage as IImage;
use Intervention\Image\ImageCache;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class GenerateAnnotationPatch extends Job implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * The ID of the annotation to generate a patch for.
     *
     * @var int
     */
    private $annotationId;

    /**
     * Create a new job instance.
     *
     * @param Annotation $annotation
     *
     * @return void
     */
    public function __construct(Annotation $annotation)
    {
        // take only the ID and not the annotation because the annotation may already be
        // deleted when this job runs and the job would fail!
        $this->annotationId = $annotation->id;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $annotation = Annotation::with('image.volume')->find($this->annotationId);
        // annotation may have been deleted in the meantime
        if ($annotation === null) {
            return;
        }

        $image = $annotation->image;
        $prefix = config('largo.patch_storage').'/'.$image->volume_id;
        $format = config('largo.patch_format');
        $padding = config('largo.patch_padding');
        $points = $annotation->points;

        $thumbWidth = config('thumbnails.width');
        $thumbHeight = config('thumbnails.height');

        if (!File::exists($prefix)) {
            // make recursive
            File::makeDirectory($prefix, 0755, true);
        }

        switch ($annotation->shape_id) {
            case Shape::$pointId:
                $pointPadding = config('largo.point_padding');
                $xmin = $points[0] - $pointPadding;
                $xmax = $points[0] + $pointPadding;
                $ymin = $points[1] - $pointPadding;
                $ymax = $points[1] + $pointPadding;
                break;

            case Shape::$circleId:
                $xmin = $points[0] - $points[2];
                $xmax = $points[0] + $points[2];
                $ymin = $points[1] - $points[2];
                $ymax = $points[1] + $points[2];
                break;

            default:
                $xmin = INF;
                $xmax = -INF;
                $ymin = INF;
                $ymax = -INF;
                foreach ($points as $index => $value) {
                    if ($index % 2 === 0) {
                        $xmin = min($xmin, $value);
                        $xmax = max($xmax, $value);
                    } else {
                        $ymin = min($ymin, $value);
                        $ymax = max($ymax, $value);
                    }
                }
        }

        $xmin -= $padding;
        $xmax += $padding;
        $ymin -= $padding;
        $ymax += $padding;

        $width = $xmax - $xmin;
        $height = $ymax - $ymin;

        $widthRatio = $width / $thumbWidth;
        $heightRatio = $height / $thumbHeight;

        // increase the size of the patch so its aspect ratio is the same than the
        // ratio of the thumbnail dimensions
        if ($widthRatio > $heightRatio) {
            $newHeight = round($thumbHeight * $widthRatio);
            $ymin -= round(($newHeight - $height) / 2);
            $height = $newHeight;
        } else {
            $newWidth = round($thumbWidth * $heightRatio);
            $xmin -= round(($newWidth - $width) / 2);
            $width = $newWidth;
        }

        // InterventionImage::crop() only accepts integer arguments
        $width = intval(round($width));
        $height = intval(round($height));
        $xmin = intval(round($xmin));
        $ymin = intval(round($ymin));

        $memoryLimit = ini_get('memory_limit');

        // increase memory limit for modifying large images
        ini_set('memory_limit', config('largo.memory_limit'));

        try {
            if ($image->volume->isRemote()) {
                // Like InterventionImage::cache() from the documentation but this has
                // better testability.
                $interventionImage = App::make(ImageCache::class)
                    ->make($image->url)
                    ->get(config('largo.imagecache_lifetime'), true);
            } else {
                $interventionImage = IImage::make($image->url);
            }

            $interventionImage->crop($width, $height, $xmin, $ymin)
                ->resize($thumbWidth, $thumbHeight)
                // This will automatically encode the image to $format.
                ->save("{$prefix}/{$annotation->id}.{$format}")
                ->destroy();
        } finally {
            // restore default memory limit
            ini_set('memory_limit', $memoryLimit);
        }

    }
}
