/*
 * This file is part of Cockpit.
 *
 * Copyright (C) 2015 Red Hat, Inc.
 *
 * Cockpit is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation; either version 2.1 of the License, or
 * (at your option) any later version.
 *
 * Cockpit is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Cockpit; If not, see <http://www.gnu.org/licenses/>.
 */

(function() {
    "use strict";

    angular.module('registry.images', [
        'ngRoute',
        'kubeClient',
    ])

    .config([
        '$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/images', {
                templateUrl: 'views/images-page.html',
                controller: 'ImagesCtrl',
                reloadOnSearch: false,
            });
        }
    ])

    .controller('ImagesCtrl', [
        '$scope',
        'kubeLoader',
        'kubeSelect',
        'imageLoader',
        function($scope, loader, select, image_loader) {
            image_loader.watch();

            /*
             * Filters selection to those with names that are
             * in the given TagEvent.
             */
            select.register("taggedBy", function(images, tag) {
                var i, len, results = { };
                for (i = 0, len = tag.items.length; i < len; i++)
                    images.name(tag.items[i].image).extend(results);
                return select(results);
            });

            $scope.images = function(tag) {
                var result = select().kind("Image").taggedBy(tag);
                return result;
            };

            $scope.imagestreams = function() {
                return select().kind("ImageStream");
            };
        }
    ])

    .factory("imageLoader", [
        "kubeLoader",
        function(loader) {
            var watching;

            /* Called when we have to load images via imagestreams */
            function handle_imagestreams(objects) {
                for (var link in objects) {
                    if (objects[link].kind === "ImageStream")
                        handle_imagestream(objects[link]);
                }
            }

            function handle_imagestream(imagestream) {
                var meta = imagestream.metadata || { };
                var status = imagestream.status || { };
                angular.forEach(status.tags || [ ], function(tag) {
                    angular.forEach(tag.items || [ ], function(item) {
                        var link = loader.resolve("Image", item.image);
                        if (link in loader.objects)
                            return;

                        /* An interim object while we're loading */
                        var interim = { kind: "Image", apiVersion: "v1", metadata: { name: item.image } };
                        loader.handle(interim);

                        var name = meta.name + "@" + item.image;
                        loader.load("ImageStreamImage", name, meta.namespace).then(function(resource) {
                            var image = resource.image;
                            if (image) {
                                image.kind = "Image";
                                loader.handle(image);
                            }
                        }, function(response) {
                            console.warn("couldn't load image: " + response.statusText);
                            interim.metadata.resourceVersion = "invalid";
                        });
                    });
                });
            }

            return {
                watch: function() {
                    if (watching)
                        return;

                    /* Load images, but fallback to loading individually */
                    watching = loader.watch("imagestreams");
                    loader.watch("images").catch(function(response) {
                        loader.listen(handle_imagestreams);
                    });
                },
                load: function(imagestream) {
                    handle_imagestream(imagestream);
                },
            };
        }
    ]);

}());
