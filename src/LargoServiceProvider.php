<?php

namespace Biigle\Modules\Largo;

use Illuminate\Support\ServiceProvider;
use Illuminate\Routing\Router;
use Biigle\Modules\Largo\Listeners\ImagesCleanupListener;
use Biigle\Services\Modules;

class LargoServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application events.
     *
     * @param  \Biigle\Services\Modules  $modules
     * @param  \Illuminate\Routing\Router  $router
     *
     * @return void
     */
    public function boot(Modules $modules, Router $router)
    {
        $this->loadViewsFrom(__DIR__.'/resources/views', 'largo');

        $this->publishes([
            __DIR__.'/public/assets' => public_path('vendor/largo'),
        ], 'public');

        $this->publishes([
            __DIR__.'/config/largo.php' => config_path('largo.php'),
        ], 'config');

        $router->group([
            'namespace' => 'Biigle\Modules\Largo\Http\Controllers',
            'middleware' => 'web',
        ], function ($router) {
            require __DIR__.'/Http/routes.php';
        });

        \Biigle\Annotation::observe(new \Biigle\Modules\Largo\Observers\AnnotationObserver);

        \Event::listen('images.cleanup', ImagesCleanupListener::class);

        $modules->addMixin('largo', 'volumesSidebar');
        $modules->addMixin('largo', 'annotationsScripts');
        $modules->addMixin('largo', 'annotationsStyles');
        $modules->addMixin('largo', 'annotationsSettingsTab');
        $modules->addMixin('largo', 'annotationsLabelsTab');
        $modules->addMixin('largo', 'projectsShowToolbar');
        $modules->addMixin('largo', 'annotationsManualSidebarSettings');
        $modules->addMixin('largo', 'annotationsManualSidebarLabelTrees');
    }

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        $this->mergeConfigFrom(__DIR__.'/config/largo.php', 'largo');

        $this->app->singleton('command.largo.publish', function ($app) {
            return new \Biigle\Modules\Largo\Console\Commands\Publish();
        });
        $this->commands('command.largo.publish');

        $this->app->singleton('command.largo.config', function ($app) {
            return new \Biigle\Modules\Largo\Console\Commands\Config();
        });
        $this->commands('command.largo.config');

        $this->app->singleton('command.largo.generate-missing', function ($app) {
            return new \Biigle\Modules\Largo\Console\Commands\GenerateMissing();
        });
        $this->commands('command.largo.generate-missing');
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides()
    {
        return [
            'command.largo.publish',
            'command.largo.config',
            'command.largo.generate-missing',
        ];
    }
}
