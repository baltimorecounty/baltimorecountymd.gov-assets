describe('County News Snippet', function() {
    it('shows published date as the Eastern Standard Time Date when the GMT date is the same day', function() {
        let actual = ShowNews.getDisplayDate("Wed, 24 May 2017 13:00:00 GMT");
        let expected = "May 24";
        expect(actual).toBe(expected);
    });

    it('shows published date as the Eastern Standard Time Date when the GMT is within 4 hours of the previous day', function() {
        let actual = ShowNews.getDisplayDate("Wed, 25 May 2017 02:02:00 GMT");
        let expected = "May 24";

        expect(actual).toBe(expected);
    });
});