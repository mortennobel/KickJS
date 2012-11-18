define(["./core/BuiltInResourceProvider", "./core/ChunkData", "./core/Config", "./core/Constants", "./core/Engine", "./core/EventQueue", "./core/GLState", "./core/KeyInput", "./core/MouseInput", "./core/Project", "./core/ProjectAsset", "./core/ResourceDescriptor", "./core/ResourceLoader", "./core/ResourceProvider", "./core/ResourceTracker", "./core/Time", "./core/URLResourceProvider", "./core/Util"],
    function (BuiltInResourceProvider, ChunkData, Config, Constants, Engine, EventQueue, GLState, KeyInput, MouseInput, Project, ProjectAsset, ResourceDescriptor, ResourceLoader, ResourceProvider, ResourceTracker, Time, URLResourceProvider, Util) {
        "use strict";

        return {
            BuiltInResourceProvider: BuiltInResourceProvider,
            ChunkData: ChunkData,
            Config: Config,
            Constants: Constants,
            Engine: Engine,
            EventQueue: EventQueue,
            GLState: GLState,
            KeyInput: KeyInput,
            MouseInput: MouseInput,
            Project: Project,
            ProjectAsset: ProjectAsset,
            ResourceDescriptor: ResourceDescriptor,
            ResourceLoader: ResourceLoader,
            ResourceProvider: ResourceProvider,
            ResourceTracker: ResourceTracker,
            Time: Time,
            URLResourceProvider: URLResourceProvider,
            Util: Util
        };
    });