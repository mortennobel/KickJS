define(["./math/Vec2", "./math/Vec3", "./math/Vec4", "./math/Mat3", "./math/Mat4", "./math/Quat4", "./math/Frustum", "./math/Aabb"],
    function (vec2, vec3, vec4, mat3, mat4, quat4, frustum, aabb) {
        return {
            Vec2: vec2,
            Vec3: vec3,
            Vec4: vec4,
            Mat3: mat3,
            Mat4: mat4,
            Quat4: quat4,
            Frustum: frustum,
            Aabb: aabb
        };
    }
);