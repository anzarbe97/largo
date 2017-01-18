<?php

namespace Biigle\Tests\Modules\Largo\Listeners;

use TestCase;
use Biigle\Tests\AnnotationTest;
use Biigle\Modules\Largo\Jobs\RemoveAnnotationPatches;
use Biigle\Modules\Largo\Jobs\GenerateAnnotationPatch;

class LargoModuleObserversAnnotationObserverTest extends TestCase
{
    public function testDeleting()
    {
        $annotation = AnnotationTest::create();
        $this->expectsJobs(RemoveAnnotationPatches::class);
        $annotation->delete();
    }

    public function testCreated()
    {
        $this->expectsJobs(GenerateAnnotationPatch::class);
        $annotation = AnnotationTest::create();
    }

    public function testSaved()
    {
        $annotation = AnnotationTest::create();
        $this->expectsJobs(GenerateAnnotationPatch::class);
        $annotation->save();
    }
}
