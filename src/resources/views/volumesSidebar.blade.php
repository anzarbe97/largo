@can ('edit-in', $volume)
    <sidebar-tab name="largo" icon="check" title="Perform Largo re-evaluation of annotations for this volume" href="{{ route('largo', $volume->id) }}"></sidebar-tab>
@endcan