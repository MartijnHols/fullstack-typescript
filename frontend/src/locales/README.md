# Adding a language

To add a lingui execute these steps:

1. In the frontend folder run: `yarn lingui add-locale en`. Replace `en` with the desired country code. A country code may have a region as well. For example for Dutch you may want to use `nl-nl` and `nl-be` instead of just `nl` so you can use different messages for the Flemish Dutch speaking Belgium market.
2. Add the language to the `Language` enum in the Language`.ts` file.
3. Add the language to the language selection dropdown.
