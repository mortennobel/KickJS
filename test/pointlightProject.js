var pointProject = {
   "engineVersion": "0.3.0",
   "maxUID": 80,
   "activeScene": 1,
   "resourceDescriptors": [
      {
         "type": "KICK.scene.Scene",
         "uid": 1,
         "config": {
            "uid": 1,
            "gameObjects": [
               {
                  "name": "Camera",
                  "layer": 1,
                  "uid": 14,
                  "components": [
                     {
                        "type": "KICK.scene.Transform",
                        "uid": 20,
                        "config": {
                           "localPosition": [
                              2,
                              1,
                              20
                           ],
                           "localRotation": [
                              0,
                              0,
                              0,
                              1
                           ],
                           "localScale": [
                              1,
                              1,
                              1
                           ],
                           "parent": null
                        }
                     },
                     {
                        "type": "KICK.scene.Camera",
                        "uid": 15,
                        "config": {
                           "enabled": true,
                           "renderShadow": false,
                           "renderer": "KICK.renderer.ForwardRenderer",
                           "layerMask": 4294967295,
                           "renderTarget": null,
                           "fieldOfView": 60,
                           "near": 0.1,
                           "far": 1000,
                           "perspective": true,
                           "left": -1,
                           "right": 1,
                           "bottom": -1,
                           "top": 1,
                           "cameraIndex": 1,
                           "clearColor": [
                              0,
                              0,
                              0,
                              1
                           ],
                           "clearFlagColor": true,
                           "clearFlagDepth": true,
                           "normalizedViewportRect": [
                              0,
                              0,
                              1,
                              1
                           ]
                        }
                     }
                  ]
               },
               {
                  "name": "Red",
                  "layer": 1,
                  "uid": 24,
                  "components": [
                     {
                        "type": "KICK.scene.Transform",
                        "uid": 30,
                        "config": {
                           "localPosition": [
                              10,
                              0,
                              0
                           ],
                           "localRotation": [
                              0,
                              0,
                              0,
                              1
                           ],
                           "localScale": [
                              1,
                              1,
                              1
                           ],
                           "parent": null
                        }
                     },
                     {
                        "type": "KICK.scene.MeshRenderer",
                        "uid": 60,
                        "config": {
                           "materials": [
                              {
                                 "ref": 8,
                                 "name": "Red",
                                 "reftype": "project"
                              }
                           ],
                           "mesh": {
                              "ref": -302,
                              "name": "Uvsphere",
                              "reftype": "project"
                           },
                           "uid": 60,
                           "scriptPriority": 0
                        }
                     }
                  ]
               },
               {
                  "name": "PointLight",
                  "layer": 1,
                  "uid": 26,
                  "components": [
                     {
                        "type": "KICK.scene.Transform",
                        "uid": 31,
                        "config": {
                           "localPosition": [
                              0,
                              0,
                              0
                           ],
                           "localRotation": [
                              0,
                              0,
                              0,
                              1
                           ],
                           "localScale": [
                              0.10000000149011612,
                              0.10000000149011612,
                              0.10000000149011612
                           ],
                           "parent": null
                        }
                     },
                     {
                        "type": "KICK.scene.Light",
                        "uid": 27,
                        "config": {
                           "shadow": false,
                           "shadowStrength": 1,
                           "shadowBias": 0.05,
                           "color": [
                              1,
                              1,
                              1
                           ],
                           "type": 3,
                           "intensity": 1,
                           "attenuation": [
                              1,
                              0,
                              0
                           ],
                           "colorIntensity": [
                              1,
                              1,
                              1
                           ],
                           "scriptPriority": 0,
                           "uid": 27
                        }
                     },
                     {
                        "type": "KICK.scene.MeshRenderer",
                        "uid": 61,
                        "config": {
                           "materials": [
                              {
                                 "ref": 29,
                                 "name": "LightSource",
                                 "reftype": "project"
                              }
                           ],
                           "mesh": {
                              "ref": -302,
                              "name": "Uvsphere",
                              "reftype": "project"
                           },
                           "uid": 61,
                           "scriptPriority": 0
                        }
                     }
                  ]
               },
               {
                  "name": "Green",
                  "layer": 1,
                  "uid": 32,
                  "components": [
                     {
                        "type": "KICK.scene.Transform",
                        "uid": 38,
                        "config": {
                           "localPosition": [
                              0,
                              10,
                              0
                           ],
                           "localRotation": [
                              0,
                              0,
                              0,
                              1
                           ],
                           "localScale": [
                              1,
                              1,
                              1
                           ],
                           "parent": null
                        }
                     },
                     {
                        "type": "KICK.scene.MeshRenderer",
                        "uid": 62,
                        "config": {
                           "materials": [
                              {
                                 "ref": 34,
                                 "name": "Green",
                                 "reftype": "project"
                              }
                           ],
                           "mesh": {
                              "ref": -302,
                              "name": "Uvsphere",
                              "reftype": "project"
                           },
                           "uid": 62,
                           "scriptPriority": 0
                        }
                     }
                  ]
               },
               {
                  "name": "Blue",
                  "layer": 1,
                  "uid": 36,
                  "components": [
                     {
                        "type": "KICK.scene.Transform",
                        "uid": 39,
                        "config": {
                           "localPosition": [
                              0,
                              0,
                              10
                           ],
                           "localRotation": [
                              0,
                              0,
                              0,
                              1
                           ],
                           "localScale": [
                              1,
                              1,
                              1
                           ],
                           "parent": null
                        }
                     },
                     {
                        "type": "KICK.scene.MeshRenderer",
                        "uid": 63,
                        "config": {
                           "materials": [
                              {
                                 "ref": 35,
                                 "name": "Blue",
                                 "reftype": "project"
                              }
                           ],
                           "mesh": {
                              "ref": -302,
                              "name": "Uvsphere",
                              "reftype": "project"
                           },
                           "uid": 63,
                           "scriptPriority": 0
                        }
                     }
                  ]
               }
            ],
            "name": "Scene"
         }
      },
      {
         "type": "KICK.material.Material",
         "uid": 8,
         "config": {
            "uid": 8,
            "name": "Red",
            "shader": {
               "ref": -101,
               "name": "Specular",
               "reftype": "project"
            },
            "uniforms": {
               "mainColor": {
                  "type": 35665,
                  "value": [
                     1,
                     0,
                     0,
                     1
                  ]
               },
               "mainTexture": {
                  "type": 35678,
                  "value": {
                     "ref": -201,
                     "name": "White",
                     "reftype": "project"
                  }
               },
               "specularColor": {
                  "type": 35666,
                  "value": [
                     1,
                     1,
                     1,
                     1
                  ]
               },
               "specularExponent": {
                  "type": 5126,
                  "value": [
                     50
                  ]
               }
            }
         }
      },
      {
         "type": "KICK.material.Material",
         "uid": 29,
         "config": {
            "uid": 29,
            "name": "LightSource",
            "shader": {
               "ref": -102,
               "name": "Unlit",
               "reftype": "project"
            },
            "uniforms": {
               "mainColor": {
                  "type": 35665,
                  "value": [
                     1,
                     1,
                     0,
                     1
                  ]
               },
               "mainTexture": {
                  "type": 35678,
                  "value": {
                     "ref": -201,
                     "name": "White",
                     "reftype": "project"
                  }
               }
            }
         }
      },
      {
         "type": "KICK.material.Material",
         "uid": 34,
         "config": {
            "uid": 34,
            "name": "Green",
            "shader": {
               "ref": -101,
               "name": "Specular",
               "reftype": "project"
            },
            "uniforms": {
               "mainColor": {
                  "type": 35665,
                  "value": [
                     0,
                     1,
                     0,
                     1
                  ]
               },
               "mainTexture": {
                  "type": 35678,
                  "value": {
                     "ref": -201,
                     "name": "White",
                     "reftype": "project"
                  }
               },
               "specularColor": {
                  "type": 35666,
                  "value": [
                     1,
                     1,
                     1,
                     1
                  ]
               },
               "specularExponent": {
                  "type": 5126,
                  "value": [
                     50
                  ]
               }
            }
         }
      },
      {
         "type": "KICK.material.Material",
         "uid": 35,
         "config": {
            "uid": 35,
            "name": "Blue",
            "shader": {
               "ref": -101,
               "name": "Specular",
               "reftype": "project"
            },
            "uniforms": {
               "mainColor": {
                  "type": 35665,
                  "value": [
                     0,
                     0,
                     1,
                     1
                  ]
               },
               "mainTexture": {
                  "type": 35678,
                  "value": {
                     "ref": -201,
                     "name": "White",
                     "reftype": "project"
                  }
               },
               "specularColor": {
                  "type": 35666,
                  "value": [
                     1,
                     1,
                     1,
                     1
                  ]
               },
               "specularExponent": {
                  "type": 5126,
                  "value": [
                     50
                  ]
               }
            }
         }
      },
      {
         "type": "KICK.scene.Scene",
         "uid": 43,
         "config": {
            "uid": 43,
            "gameObjects": [
               {
                  "layer": 1,
                  "uid": 44,
                  "components": [
                     {
                        "type": "KICK.scene.Transform",
                        "uid": 47,
                        "config": {
                           "localPosition": [
                              0,
                              0,
                              0
                           ],
                           "localRotation": [
                              0,
                              0,
                              0,
                              1
                           ],
                           "localScale": [
                              1,
                              1,
                              1
                           ],
                           "parent": null
                        }
                     },
                     {
                        "type": "KICK.scene.Camera",
                        "uid": 45,
                        "config": {
                           "enabled": true,
                           "renderShadow": false,
                           "renderer": "KICK.renderer.ForwardRenderer",
                           "layerMask": 4294967295,
                           "renderTarget": null,
                           "fieldOfView": 60,
                           "near": 0.1,
                           "far": 1000,
                           "perspective": true,
                           "left": -1,
                           "right": 1,
                           "bottom": -1,
                           "top": 1,
                           "cameraIndex": 1,
                           "clearColor": [
                              0,
                              0,
                              0,
                              1
                           ],
                           "clearFlagColor": true,
                           "clearFlagDepth": true,
                           "normalizedViewportRect": [
                              0,
                              0,
                              1,
                              1
                           ]
                        }
                     }
                  ]
               }
            ],
            "name": "Scene"
         }
      },
      {
         "type": "KICK.scene.Scene",
         "uid": 55,
         "config": {
            "uid": 55,
            "gameObjects": [
               {
                  "layer": 1,
                  "uid": 56,
                  "components": [
                     {
                        "type": "KICK.scene.Transform",
                        "uid": 59,
                        "config": {
                           "localPosition": [
                              0,
                              0,
                              0
                           ],
                           "localRotation": [
                              0,
                              0,
                              0,
                              1
                           ],
                           "localScale": [
                              1,
                              1,
                              1
                           ],
                           "parent": null
                        }
                     },
                     {
                        "type": "KICK.scene.Camera",
                        "uid": 57,
                        "config": {
                           "enabled": true,
                           "renderShadow": false,
                           "renderer": "KICK.renderer.ForwardRenderer",
                           "layerMask": 4294967295,
                           "renderTarget": null,
                           "fieldOfView": 60,
                           "near": 0.1,
                           "far": 1000,
                           "perspective": true,
                           "left": -1,
                           "right": 1,
                           "bottom": -1,
                           "top": 1,
                           "cameraIndex": 1,
                           "clearColor": [
                              0,
                              0,
                              0,
                              1
                           ],
                           "clearFlagColor": true,
                           "clearFlagDepth": true,
                           "normalizedViewportRect": [
                              0,
                              0,
                              1,
                              1
                           ]
                        }
                     }
                  ]
               }
            ],
            "name": "Scene"
         }
      },
      {
         "type": "KICK.scene.Scene",
         "uid": 67,
         "config": {
            "uid": 67,
            "gameObjects": [
               {
                  "layer": 1,
                  "uid": 68,
                  "components": [
                     {
                        "type": "KICK.scene.Transform",
                        "uid": 71,
                        "config": {
                           "localPosition": [
                              0,
                              0,
                              0
                           ],
                           "localRotation": [
                              0,
                              0,
                              0,
                              1
                           ],
                           "localScale": [
                              1,
                              1,
                              1
                           ],
                           "parent": null
                        }
                     },
                     {
                        "type": "KICK.scene.Camera",
                        "uid": 69,
                        "config": {
                           "enabled": true,
                           "renderShadow": false,
                           "renderer": "KICK.renderer.ForwardRenderer",
                           "layerMask": 4294967295,
                           "renderTarget": null,
                           "fieldOfView": 60,
                           "near": 0.1,
                           "far": 1000,
                           "perspective": true,
                           "left": -1,
                           "right": 1,
                           "bottom": -1,
                           "top": 1,
                           "cameraIndex": 1,
                           "clearColor": [
                              0,
                              0,
                              0,
                              1
                           ],
                           "clearFlagColor": true,
                           "clearFlagDepth": true,
                           "normalizedViewportRect": [
                              0,
                              0,
                              1,
                              1
                           ]
                        }
                     }
                  ]
               }
            ],
            "name": "Scene"
         }
      },
      {
         "type": "KICK.scene.Scene",
         "uid": 76,
         "config": {
            "uid": 76,
            "gameObjects": [
               {
                  "layer": 1,
                  "uid": 77,
                  "components": [
                     {
                        "type": "KICK.scene.Transform",
                        "uid": 80,
                        "config": {
                           "localPosition": [
                              0,
                              0,
                              0
                           ],
                           "localRotation": [
                              0,
                              0,
                              0,
                              1
                           ],
                           "localScale": [
                              1,
                              1,
                              1
                           ],
                           "parent": null
                        }
                     },
                     {
                        "type": "KICK.scene.Camera",
                        "uid": 78,
                        "config": {
                           "enabled": true,
                           "renderShadow": false,
                           "renderer": "KICK.renderer.ForwardRenderer",
                           "layerMask": 4294967295,
                           "renderTarget": null,
                           "fieldOfView": 60,
                           "near": 0.1,
                           "far": 1000,
                           "perspective": true,
                           "left": -1,
                           "right": 1,
                           "bottom": -1,
                           "top": 1,
                           "cameraIndex": 1,
                           "clearColor": [
                              0,
                              0,
                              0,
                              1
                           ],
                           "clearFlagColor": true,
                           "clearFlagDepth": true,
                           "normalizedViewportRect": [
                              0,
                              0,
                              1,
                              1
                           ]
                        }
                     }
                  ]
               }
            ],
            "name": "Scene"
         }
      }
   ]
};