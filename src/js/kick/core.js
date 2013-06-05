define(["./core/BuiltInResourceProvider", "./core/ChunkData", "./core/Config", "./core/Constants", "./core/Engine", "./core/EventQueue", "./core/GLState", "./core/KeyInput", "./core/MouseInput", "./core/Project", "./core/ProjectAsset", "./core/ResourceDescriptor", "./core/ResourceLoader", "./core/ResourceProvider", "./core/Time", "./core/URLResourceProvider", "./core/Util", "./core/EngineSingleton", "./core/Observable", "./core/Graphics"],
    function (BuiltInResourceProvider, ChunkData, Config, Constants, Engine, EventQueue, GLState, KeyInput, MouseInput, Project, ProjectAsset, ResourceDescriptor, ResourceLoader, ResourceProvider, Time, URLResourceProvider, Util, EngineSingleton, Observable, Graphics) {
        "use strict";

        return {
            BuiltInResourceProvider: BuiltInResourceProvider,
            ChunkData: ChunkData,
            Config: Config,
            Constants: Constants,
            Engine: Engine,
            EngineSingleton: EngineSingleton,
            EventQueue: EventQueue,
            GLState: GLState,
            Graphics: Graphics,
            KeyInput: KeyInput,
            MouseInput: MouseInput,
            Observable: Observable,
            Project: Project,
            ProjectAsset: ProjectAsset,
            ResourceDescriptor: ResourceDescriptor,
            ResourceLoader: ResourceLoader,
            ResourceProvider: ResourceProvider,
            Time: Time,
            URLResourceProvider: URLResourceProvider,
            Util: Util
        };
    });