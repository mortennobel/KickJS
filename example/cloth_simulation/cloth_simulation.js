requirejs.config({
    baseUrl: '.',
    paths: {
        kick: location.search === "?debug" ? '../../build/kick-debug': '../../build/kick',
        text: '../../dependencies/text'
    }
});

requirejs(['kick', 'text!diffuse_doubleside_fs.glsl', 'text!diffuse_doubleside_vs.glsl'],
    function (kick, fs, vs) {
        "use strict";
// Cloth simulation based on Mosegaards Cloth Simulation Coding Tutorial
// http://cg.alexandra.dk/2009/06/02/mosegaards-cloth-simulation-coding-tutorial/

        var engine,
            vec3 = kick.math.Vec3,
            vec4 = kick.math.Vec4,
            DAMPING = 0.01, // how much to damp the cloth simulation each frame
            TIME_STEPSIZE2  = 0.5 * 0.5, // how large time step each particle takes each frame
            CONSTRAINT_ITERATIONS = 3,
            meshResolution = 16,
            ball_radius = 2, // the radius of our one ball
            vec3Zero = [0, 0, 0], // how many iterations of constraint satisfaction each frame (more is rigid, less is soft);
            gravityForce = vec3.clone([0, -0.2 * TIME_STEPSIZE2, 0]),
            windForce = vec3.clone([0.2 * TIME_STEPSIZE2, 0, 0.05 * TIME_STEPSIZE2]);
        function initKick() {
            engine = new kick.core.Engine('canvas', {
                enableDebugContext: location.search === "?debug" // debug enabled if query == debug
            });
            buildScene();
        }

        function buildScene() {
            var scene = engine.activeScene;
            buildCamera(scene);
            buildLight(scene);
            buildBackground(scene);
            buildBall(scene);
            buildCloth(scene);
            var fullWindow = scene.createGameObject({name: "FullWindow"});
            fullWindow.addComponent(new kick.components.FullWindow());
        }

        function buildCamera(scene) {
            var cameraGO = scene.createGameObject({name: "Camera"});
            var camera = new kick.scene.Camera({
                fieldOfView: 60
            });
            camera.clearColor = [0.2, 0.2, 0.4, 1];
            cameraGO.addComponent(camera);
            var cameraTransform = cameraGO.transform;
            cameraTransform.localPosition = [-5.5, -5.5, 13.0];
            cameraTransform.localRotationEuler = [0, -40, 0];
        }

        function buildCloth(scene) {
            var clothGO = scene.createGameObject({name: "Cloth"});
            clothGO.addComponent(new ClothComponent(14, 10, meshResolution, meshResolution));
            var clothMeshRenderer = new kick.scene.MeshRenderer();
            var shader = new kick.material.Shader( {
                vertexShaderSrc: vs,
                fragmentShaderSrc: fs,
                faceCulling:  kick.core.Constants.GL_NONE
            });
            clothMeshRenderer.material = new kick.material.Material({
                shader:shader,
                uniformData:{
                    mainColor: [1.0, 1.0, 1.0, 1.0],
                    mainTexture: engine.project.load(engine.project.ENGINE_TEXTURE_LOGO)
                }
            });
            clothGO.addComponent(clothMeshRenderer);
        }

        function buildBall(scene){
            var ballGO = scene.createGameObject({name: "Ball"});
            var ballMeshRenderer = new kick.scene.MeshRenderer();
            //new KICK.mesh.Mesh({dataURI: "kickjs://mesh/uvsphere/?slices=10&stacks=5"});
            ballMeshRenderer.mesh = new kick.mesh.Mesh(
                {
                    dataURI: "kickjs://mesh/uvsphere/?slices=25&stacks=50&radius=" + (ball_radius - 0.2),
                    name: "Default object"
                });

            var shader = engine.project.load(engine.project.ENGINE_SHADER_SPECULAR);
            ballMeshRenderer.material = new kick.material.Material( {
                shader: shader,
                uniformData: {
                    mainColor: [1.0, 0.0, 0.9, 1.0],
                    mainTexture: engine.project.load(engine.project.ENGINE_TEXTURE_WHITE),
                    specularExponent: 50,
                    specularColor: [1, 1, 1, 1]
                }
            });
            ballGO.addComponent(ballMeshRenderer);
            ballGO.addComponent(new BallUpdater());
        }

        function buildLight(scene){
            var lightGO = scene.createGameObject({name:"Light"}),
                light = new kick.scene.Light({
                    type: kick.scene.Light.TYPE_DIRECTIONAL,
                    color: [1.0, 1.0, 1.0]
                });
            lightGO.addComponent(light);
            lightGO.transform.localRotationEuler = [0,0,0];

            var lightAmbient = new kick.scene.Light({
                type: kick.scene.Light.TYPE_AMBIENT,
                color: [0.1,0.1,0.1]
            });
            lightGO.addComponent(lightAmbient);
        }

        function buildBackground(scene){
            var backgroundGO = scene.createGameObject({name:"Background"}),
                backgroundMeshRenderer = new kick.scene.MeshRenderer();

            backgroundMeshRenderer.mesh = new kick.mesh.Mesh(
                {
                    dataURI: "kickjs://mesh/plane/",
                    name: "Default object"
                });
            // modify the mesh to add colors in the corners (which will be interpolated as a smooth background)
            var meshData = backgroundMeshRenderer.mesh.meshData;
            var color = new Float32Array((meshData.vertex.length/3)*4);
            var color1 = [146/255,194/255,136/255,1];
            var color2 = [79/255,0,1,1];
            vec4.copy(color.subarray(0,4), color1);
            vec4.copy(color.subarray(4,8), color2);
            vec4.copy(color.subarray(8,12), color1);
            vec4.copy(color.subarray(12,16), color2);
            meshData.color = color;
            backgroundMeshRenderer.mesh.meshData = meshData;
            var shaderUnlit = engine.project.load(engine.project.ENGINE_SHADER_UNLIT_VERTEX_COLOR);
            backgroundMeshRenderer.material = new kick.material.Material( {
                shader: shaderUnlit,
                uniformData: {
                    mainColor: [1.0, 1.0, 1.0, 1.0],
                    mainTexture: engine.project.load(engine.project.ENGINE_TEXTURE_WHITE)
                }
            });
            backgroundGO.addComponent(backgroundMeshRenderer);
            var transform = backgroundGO.transform;
            transform.localScale = [50, 50, 50];
            transform.localPosition = [10, 0, -10];
        }

        function BallUpdater() {
            var time,
                thisObj = this,
                thisTransform,
                ballPosition = [7, -5, 0],
                ball_time = 0;

            this.activated = function () {
                time = kick.core.Engine.instance.time;
                thisTransform = thisObj.gameObject.transform;
            };

            this.update = function () {
                ballPosition[2] = Math.cos(ball_time++ / 50.0) * 7;
                thisTransform.position = ballPosition;
            };
        }

        var Particle = function (newPos){
            var floatSubArray = new Float32Array(Particle.FLOAT_ELEMENTS),
                pos = floatSubArray.subarray(2,5), // the current position of the particle in 3D space
                old_pos = floatSubArray.subarray(5,8), // the position of the particle in the previous time step, used as part of the verlet numerical integration scheme
                acceleration = floatSubArray.subarray(8,11), // a vector representing the current acceleration of the particle
                accumulated_normal = floatSubArray.subarray(11,14),
                temp = floatSubArray.subarray(14,17),
                temp2 = floatSubArray.subarray(17,20),
                thisObj = this; // an accumulated normal (i.e. non normalized), used for OpenGL soft shading

            // The reason to use properties this way is to maintain the original memory layout
            Object.defineProperties(this, {
                movable: {
                    get: function () {
                        return floatSubArray[0];
                    },
                    set: function (newValue) {
                        floatSubArray[0] = newValue;
                    }
                },
                mass: {
                    get: function () {
                        return floatSubArray[1];
                    },
                    set: function (newValue) {
                        floatSubArray[1] = newValue;
                    }
                },
                pos: {
                    get: function () {
                        return pos;
                    },
                    set: function (newValue) {
                        vec3.copy(pos, newValue);
                    }
                },
                old_pos: {
                    get: function () {
                        return old_pos;
                    },
                    set: function (newValue) {
                        vec3.copy(old_pos, newValue);
                    }
                },
                acceleration: {
                    get: function () {
                        return acceleration;
                    },
                    set: function (newValue) {
                        vec3.copy(acceleration, newValue);
                    }
                },
                accumulated_normal: {
                    get: function () {
                        return accumulated_normal;
                    },
                    set: function (newValue) {
                        vec3.copy(accumulated_normal, newValue);
                    }
                }
            });

            /**
             *
             * @param {vec3} f
             */
            this.addForce = function (f) {
                var invMass = 1 / thisObj.mass;
                vec3.scale(temp, f, invMass);
                vec3.add(acceleration, acceleration, temp);
            };

            /* This is one of the important methods, where the time is progressed a single step size (TIME_STEPSIZE)
             The method is called by Cloth.time_step()
             Given the equation "force = mass * acceleration" the next position is found through verlet integration*/
            this.timeStep = function(){
                if (thisObj.movable){
                    /*
                     Vec3 temp = pos;
                     pos = pos + (pos-old_pos)*(1.0-DAMPING) + acceleration*TIME_STEPSIZE2;
                     old_pos = temp;
                     acceleration = Vec3(0,0,0); // acceleration is reset since it HAS been translated into a change in position (and implicitely into velocity)
                     * */
                    vec3.copy(temp2, pos);

                    vec3.subtract(temp, pos, old_pos);
                    vec3.scale(temp, temp, 1-DAMPING);
                    vec3.add(pos, pos, temp); // first part: + (pos-old_pos)*(1.0-DAMPING)
                    vec3.scale(temp, acceleration,TIME_STEPSIZE2);
                    vec3.add(pos,pos,temp); // second part: + acceleration*TIME_STEPSIZE2

                    vec3.copy(old_pos, temp2);
                    vec3.copy(acceleration, vec3Zero);
                }
            };

            /**
             * @param {vec3} v
             */
            this.offsetPos = function(v) {
                if(thisObj.movable) {
                    // if(movable) pos += v;
                    vec3.add(pos,pos,v);
                }
            };

            this.makeUnmovable = function() {
                thisObj.movable = false;
            };

            /**
             * @param {vec3} normal
             */
            this.addToNormal = function (normal) {
                // accumulated_normal += normal.normalized();
                vec3.normalize(temp, normal);
                vec3.add(accumulated_normal, accumulated_normal, temp);
            };

            this.normalize = function () {
                vec3.normalize(accumulated_normal, accumulated_normal);
            };

            this.resetNormal = function () {
                vec3.copy(accumulated_normal, vec3Zero);
            };

            (function constructor(){
                if (newPos){
                    thisObj.pos = newPos;
                    thisObj.old_pos = newPos;
                    thisObj.acceleration = [0, 0, 0];
                    thisObj.mass = 1;
                    thisObj.movable = 1;
                    thisObj.accumulated_normal = [0, 0, 0];
                }
            })();
            Object.freeze(this);
        };

        Particle.FLOAT_ELEMENTS = 20;

        /**
         * p1/p2 the two particles that are connected through this constraint
         * @param {Particle} p1
         * @param {Particle} p2
         */
        function Constraint(p1, p2) {
            var rest_distance,
                tempVec3 = vec3.create();  // the length between particle p1 and p2 in rest configuration

            (function constructor() {
                var difference = vec3.subtract(vec3.create(), p1.pos, p2.pos);
                rest_distance = vec3.length(difference);
            })();

            /**
             * This is one of the important methods, where a single constraint between two particles p1 and p2 is solved
             * the method is called by Cloth.time_step() many times per frame
             */
            this.satisfyConstraint = function () {
                vec3.subtract(tempVec3, p2.pos, p1.pos); // vector from p1 to p2
                var current_distance = vec3.length(tempVec3); // current distance between p1 and p2
                vec3.scale(tempVec3, tempVec3, 1 - rest_distance / current_distance);  // The offset vector that could moves p1 into a distance of rest_distance to p2
                vec3.scale(tempVec3, tempVec3, 0.5); // Lets make it half that length, so that we can move BOTH p1 and p2.
                p1.offsetPos(tempVec3);
                vec3.scale(tempVec3, tempVec3, -1.0);
                p2.offsetPos(tempVec3);
            };
            Object.freeze(this);
        }

        /** This is a important constructor for the entire system of particles and constraints
         *
         * @param {Number} width
         * @param {Number} height
         * @param {Number} num_particles_width number of particles in "width" direction
         * @param {Number} num_particles_height number of particles in "height" direction
         */
        function ClothComponent(width, height, num_particles_width, num_particles_height){
            var time,
                thisObj = this,
                ballTransform,
            // total number of particles is num_particles_width*num_particles_height
                particles = [],// all particles that are part of this cloth
                constraints = [], // all constraints between particles as part of this cloth
                meshData = new kick.mesh.MeshData(),
                meshRenderer,
                vertices = [],
                normals = [],
                getParticle = function (x, y) {
                    return particles[y * num_particles_width + x];
                },
                /**
                 * @param {Particle} p1
                 * @param {Particle} p2
                 */
                makeConstraint = function (p1, p2) {
                    constraints.push(new Constraint(p1, p2));
                },
            /* A private method used by updateMeshData() and addWindForcesForTriangle() to retrieve the
             normal vector of the triangle defined by the position of the particles p1, p2, and p3.
             The magnitude of the normal vector is equal to the area of the parallelogram defined by p1, p2 and p3
             */
                calcTriangleNormal = (function () {
                    var v1 = vec3.create(),
                        v2 = vec3.create();
                    return function (p1, p2, p3,dest) {
                        var pos1 = p1.pos,
                            pos2 = p2.pos,
                            pos3 = p3.pos;
                        v1 = vec3.subtract(v1, pos2, pos1);
                        v2 = vec3.subtract(v2, pos3, pos1);
                        if (!dest) {
                            console.log("dest must be set");
                        }
                        return vec3.cross(dest, v1, v2);
                    }})(),
                /**
                 *  A private method used by windForce() to calcualte the wind force for a single triangle
                 *	defined by p1,p2,p3
                 */
                addWindForcesForTriangle = (function () {
                    // create clojure to have private variables
                    var normal = vec3.create(),
                        d = vec3.create();
                    return function (p1, p2, p3, direction) {
                        /**
                         * Vec3 normal = calcTriangleNormal(p1,p2,p3);
                         Vec3 d = normal.normalized();
                         Vec3 force = normal*(d.dot(direction));
                         p1->addForce(force);
                         p2->addForce(force);
                         p3->addForce(force);
                         */
                        calcTriangleNormal(p1, p2, p3, normal);
                        vec3.normalize(d, normal);
                        var force = vec3.scale(normal, normal, vec3.dot(d, direction));
                        p1.addForce(force);
                        p2.addForce(force);
                        p3.addForce(force);
                    };
                })(),
                /** A private method used by updateMeshData(), that draws a single triangle p1,p2,p3 with a color
                 * @param {Particle} p1
                 * @param {Particle} p2
                 * @param {Particle} p3
                 * @param {Number} triangleIndex triangle index
                 */
                 drawTriangle = function (p1, p2, p3,  triangleIndex) {
                    var set = function (destArray, newValue, idx) {
                        for (var i = 0;i<newValue.length;i++){
                            destArray[idx+i] = newValue[i];
                        }
                    };
                    set(vertices,p1.pos,triangleIndex*9);
                    set(vertices,p2.pos,triangleIndex*9+3);
                    set(vertices,p3.pos,triangleIndex*9+6);

                    set(normals,p1.accumulated_normal,triangleIndex*9);
                    set(normals,p2.accumulated_normal,triangleIndex*9+3);
                    set(normals,p3.accumulated_normal,triangleIndex*9+6);


                };

            this.scriptPriority = -1; // invoked after ball update

            (function constructor(){
                particles = new Array(num_particles_width*num_particles_height); //I am essentially using this vector as an array with room for num_particles_width*num_particles_height particles


                // creating particles in a grid of particles from (0,0,0) to (width,-height,0)
                for(var x=0; x<num_particles_width; x++)
                {
                    for(var y=0; y<num_particles_height; y++)
                    {
                        var pos = vec3.clone([width * (x/num_particles_width),
                            -height * (y/num_particles_height),
                            0]);
                        particles[y*num_particles_width+x]= new Particle(pos); // insert particle in column x at y'th row
                    }
                }


                // Connecting immediate neighbor particles with constraints (distance 1 and sqrt(2) in the grid)
                for(x=0; x<num_particles_width; x++)
                {
                    for(y=0; y<num_particles_height; y++)
                    {
                        if (x<num_particles_width-1) makeConstraint(getParticle(x,y),getParticle(x+1,y));
                        if (y<num_particles_height-1) makeConstraint(getParticle(x,y),getParticle(x,y+1));
                        if (x<num_particles_width-1 && y<num_particles_height-1) makeConstraint(getParticle(x,y),getParticle(x+1,y+1));
                        if (x<num_particles_width-1 && y<num_particles_height-1) makeConstraint(getParticle(x+1,y),getParticle(x,y+1));
                    }
                }


                // Connecting secondary neighbors with constraints (distance 2 and sqrt(4) in the grid)
                for(x=0; x<num_particles_width; x++)
                {
                    for(y=0; y<num_particles_height; y++)
                    {
                        if (x<num_particles_width-2) makeConstraint(getParticle(x,y),getParticle(x+2,y));
                        if (y<num_particles_height-2) makeConstraint(getParticle(x,y),getParticle(x,y+2));
                        if (x<num_particles_width-2 && y<num_particles_height-2) makeConstraint(getParticle(x,y),getParticle(x+2,y+2));
                        if (x<num_particles_width-2 && y<num_particles_height-2) makeConstraint(getParticle(x+2,y),getParticle(x,y+2));			}
                }

                // making the upper left most three and right most three particles unmovable
                for(var i=0;i<3; i++)
                {
                    getParticle(0+i ,0).offsetPos(vec3.clone([0.5,0.0,0.0])); // moving the particle a bit towards the center, to make it hang more natural - because I like it ;)
                    getParticle(0+i ,0).makeUnmovable();

                    getParticle(0+i ,0).offsetPos(vec3.clone([-0.5,0.0,0.0])); // moving the particle a bit towards the center, to make it hang more natural - because I like it ;)
                    getParticle(num_particles_width-1-i ,0).makeUnmovable();
                }
            })();
            var updateMeshDataNormal = vec3.create();
            /* drawing the cloth as a smooth shaded (and colored according to column) OpenGL triangular mesh
             Called from the display() method
             The cloth is seen as consisting of triangles for four particles in the grid as follows:

             (x,y)   *--* (x+1,y)
             | /|
             |/ |
             (x,y+1) *--* (x+1,y+1)

             */
            this.updateMeshData = function(){
                var i, x, y;
                // reset normals (which where written to last frame)
                for (i = particles.length-1;i>=0;i--)
                {
                    particles[i].resetNormal();
                }

                //create smooth per particle normals by adding up all the (hard) triangle normals that each particle is part of
                for(x = 0; x< num_particles_width - 1; x++)
                {
                    for(y = 0; y < num_particles_height - 1; y++)
                    {
                        var normal = calcTriangleNormal(getParticle(x+1,y),getParticle(x,y),getParticle(x,y+1), updateMeshDataNormal);
                        getParticle(x+1,y).addToNormal(normal);
                        getParticle(x,y).addToNormal(normal);
                        getParticle(x,y+1).addToNormal(normal);

                        normal = calcTriangleNormal(getParticle(x+1,y+1),getParticle(x+1,y),getParticle(x,y+1), updateMeshDataNormal);
                        getParticle(x+1,y+1).addToNormal(normal);
                        getParticle(x+1,y).addToNormal(normal);
                        getParticle(x,y+1).addToNormal(normal);
                    }
                }
                for(x = 0; x< num_particles_width; x++)
                {
                    for(y = 0; y < num_particles_height; y++)
                    {
                        getParticle(x, y).normalize();
                    }
                }

                var triangleIndex = 0;
                for(x = 0; x<num_particles_width-1; x++)
                {
                    for(y=0; y<num_particles_height-1; y++)
                    {
                        drawTriangle(getParticle(x+1,y),getParticle(x,y),getParticle(x,y+1),triangleIndex);
                        triangleIndex ++;
                        drawTriangle(getParticle(x+1,y+1),getParticle(x+1,y),getParticle(x,y+1),triangleIndex);
                        triangleIndex ++;
                    }
                }
            };

            this.getUvs = function(){
                var uvs = [];

                for(var x = 0; x<num_particles_width-1; x++)
                {
                    for(var y=0; y<num_particles_height-1; y++)
                    {
                        uvs.push(x+1,y);
                        uvs.push(x,y);
                        uvs.push(x,y+1);
                        uvs.push(x+1,y+1);
                        uvs.push(x+1,y);
                        uvs.push(x,y+1);
                    }
                }
                var divX = 1/num_particles_width;
                var divY = 1/num_particles_height;
                for (var i=0;i<uvs.length;i=i+2){
                    uvs[i] *= divX;
                    uvs[i+1] *= divY;
                    uvs[i+1] = 1-uvs[i+1];
                }
                return uvs;
            };

            this.timeStep = function(){
                for(var j=0; j<CONSTRAINT_ITERATIONS; j++) // iterate over all constraints several times
                {
                    for(var i=constraints.length-1;i>=0;i--)
                    {
                        constraints[i].satisfyConstraint(); // satisfy constraint.
                    }
                }

                for(i=particles.length-1;i>=0;i--)
                {
                    particles[i].timeStep(); // calculate the position of each particle at the next time step.
                }
            };

            /* used to add gravity (or any other arbitrary vector) to all particles*/
            this.addForce = function(direction){
                for(var i=particles.length-1;i>=0;i--)
                {
                    particles[i].addForce(direction); // add the forces to each particle
                }
            };

            /* used to add wind forces to all particles, is added for each triangle since the final force is proportional to the triangle area as seen from the wind direction*/
            this.windForce = function(direction){
                for(var x = 0; x<num_particles_width-1; x++)
                {
                    for(var y=0; y<num_particles_height-1; y++)
                    {
                        addWindForcesForTriangle(getParticle(x+1,y),getParticle(x,y),getParticle(x,y+1),direction);
                        addWindForcesForTriangle(getParticle(x+1,y+1),getParticle(x+1,y),getParticle(x,y+1),direction);
                    }
                }
            };

            var ballCollisionVec3 = vec3.create();

            /* used to detect and resolve the collision of the cloth with the ball.
             This is based on a very simples scheme where the position of each particle is simply compared to the sphere and corrected.
             This also means that the sphere can "slip through" if the ball is small enough compared to the distance in the grid bewteen particles
             */
            this.ballCollision = function(center,radius )
            {
                var radiusSqr = radius*radius;
                for(var i = particles.length-1;i>=0;i--)
                {
                    vec3.subtract(ballCollisionVec3, particles[i].pos,center);
                    var l = vec3.length(ballCollisionVec3);
                    if ( vec3.squaredLength(ballCollisionVec3) < radiusSqr) // if the particle is inside the ball
                    {
                        particles[i].offsetPos(vec3.scale(ballCollisionVec3, vec3.normalize(ballCollisionVec3,ballCollisionVec3),(radius-l))); // project the particle to the surface of the ball
                    }
                }
            };

            this.activated = function(){
                time = kick.core.Engine.instance.time;
                ballTransform = thisObj.gameObject.scene.getGameObjectByName("Ball").transform;
                meshRenderer = thisObj.gameObject.getComponentOfType(kick.scene.MeshRenderer);
                meshRenderer.mesh = new kick.mesh.Mesh({name:"Cloth Mesh"});
                var indices = [];
                var indexCount = (num_particles_width-1)*(num_particles_height-1)*3*2;
                for (var i=0;i<indexCount;i++){
                    indices[i] = i;
                }
                meshData.indices = indices;
                meshData.uv1 = thisObj.getUvs();

            };

            this.update = (function(){
                return function(){
                    var localPosition = ballTransform.localPosition;

                    thisObj.addForce(gravityForce); // add gravity each frame, pointing down
                    thisObj.windForce(windForce); // generate some wind each frame
                    thisObj.timeStep(); // calculate the particle positions of the next frame
                    thisObj.ballCollision(localPosition, ball_radius); // resolve collision with the ball

                    thisObj.updateMeshData();
                    meshData.vertex = vertices;
                    meshData.normal = normals;
                    meshData.usage = kick.core.Constants.GL_STREAM_DRAW;


                    meshRenderer.mesh.updateMeshData(meshData, true, false, false);
                };
            })();
        }
        initKick();
    });