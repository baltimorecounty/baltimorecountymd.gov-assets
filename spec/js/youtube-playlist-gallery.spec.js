describe('YouTube Playlist Gallery', function() {

    describe('getYouTubeItemInfoFromPlaylistData', function() {

        var stagedPlaylistData,
            badData;
        
        beforeEach(function() {
            badData = [{},{},{}];

            stagedGoodPlaylistData = [{
                snippet: {
                    resourceId: {
                        videoId: 1
                    },
                    title: 'test 1',
                    thumbnails: {
                        medium: {
                            url: 'url1'
                        }
                    }
                }
            },
            {
                snippet: {
                    resourceId: {
                        videoId: 2
                    },
                    title: 'test 2',
                    thumbnails: {
                        medium: {
                            url: 'url2'
                        }
                    }
                }
            },
            {
                snippet: {
                    resourceId: {
                        videoId: 3
                    },
                    title: 'test 3',
                    thumbnails: {
                        medium: {
                            url: 'url3'
                        }
                    }
                }
            }];
            
            stagedIncompletePlaylistData = [{
                snippet: {
                    resourceId: {
                        videoId: 1
                    },
                    thumbnails: {
                        medium: {
                            url: 'url1'
                        }
                    }
                }
            },
            {
                snippet: {
                    resourceId: {
                        videoId: 2
                    },
                    title: 'test 2',
                    thumbnails: {                        
                    }
                }
            },
            {
                snippet: {
                    resourceId: {
                        videoId: 3
                    },
                    title: 'test 3',
                    thumbnails: {
                        medium: {
                            url: 'url3'
                        }
                    }
                }
            }];            
        });

        it('returns an array of objects containing videoId, videoTitle, thumbnailUrl, and isHidden', function() {
            var actual = baltimoreCounty.youtubePlaylistGallery.getYouTubeItemInfoFromPlaylistData(stagedPlaylistData),
                isValid = true;

            for (var i = 0; i < actual.length; i++) {
                isValid = actual[i].hasOwnProperty('videoId') && actual[i].hasOwnProperty('videoTitle') && actual[i].hasOwnProperty('thumbnailUrl') && actual[i].hasOwnProperty('isHidden');
                if (!isValid)
                    break;
            }

            expect(isValid).toBe(true);
        });

        it('returns an empty array when given a falsy argument', function() {
            var actual = baltimoreCounty.youtubePlaylistGallery.getYouTubeItemInfoFromPlaylistData(null);
            expect(actual).toEqual([]);
        });

        it('returns an empty array when there is no snippet', function() {
            var actual = baltimoreCounty.youtubePlaylistGallery.getYouTubeItemInfoFromPlaylistData(badData);
            expect(actual).toEqual([]);
        });

        it('only returns an array of complete data items', function() {
            var actual = baltimoreCounty.youtubePlaylistGallery.getYouTubeItemInfoFromPlaylistData(stagedIncompletePlaylistData);
            expect(actual.length).toEqual(1);
        });

    });

});