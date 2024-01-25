<?php

namespace Biigle\Modules\Largo\Jobs;

use Storage;
use VipsImage;
use Biigle\Shape;
use FFMpeg\FFMpeg;
use Biigle\VolumeFile;
use FFMpeg\Media\Video;
use FFMpeg\Coordinate\TimeCode;

class GenerateVideoAnnotationPatch extends GenerateAnnotationPatch
{
    /**
     * Handle a single image.
     *
     * @param VolumeFile $file
     * @param string $path Path to the cached image file.
     */
    public function handleFile(VolumeFile $file, $path)
    {
        if (count($this->annotation->frames) === 0) {
            // Expect the unexpected.
            return;
        }

        $points = $this->annotation->points[0] ?? null;
        $targetPath = $this->getTargetPath($this->annotation);

        $video = $this->getVideo($path);
        $frame = $this->getVideoFrame($video, $this->annotation->frames[0]);

        if ($this->createSVG !== 2) {
            $buffer = $this->getAnnotationPatch($frame, $points, $this->annotation->shape);
            Storage::disk($this->targetDisk)->put($targetPath, $buffer);
        }
        
        if ($this->annotation->shape->id !== Shape::wholeFrameId() && $this->createSVG) {
            $svgTargetPath = str_replace(config('largo.patch_format'), 'svg', $targetPath);
            $svgAnnotation = $this->getSVGAnnotationPatch($frame->width, $frame->height, $points, $this->annotation->shape);
            Storage::disk($this->targetDisk)->put($svgTargetPath, $svgAnnotation);
        }
    }

    /**
     * Get the FFMpeg video instance.
     *
     * @param string $path
     *
     * @return Video
     */
    protected function getVideo($path)
    {
        return FFMpeg::create()->open($path);
    }

    /**
     * Get a video frame from a specific time as VipsImage object.
     *
     * @param Video $video
     * @param float $time
     *
     * @return \Jcupitt\Vips\Image
     */
    protected function getVideoFrame(Video $video, $time)
    {
        $buffer = $video->frame(TimeCode::fromSeconds($time))->save(null, false, true);

        return VipsImage::newFromBuffer($buffer);
    }
}
