describe('searching for show', function() {
    it('searching for show should return api data back', function() {
        expect(searchShows('love')).toEqual('1');
    })
})