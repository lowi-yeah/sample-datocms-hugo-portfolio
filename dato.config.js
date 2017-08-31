const htmlTag = require('html-tag');

// This function helps transforming structures
// —eg. [{ tagName: 'meta', attributes: { name: 'description', content: 'foobar' } }]—
// into proper HTML tags: <meta name="description" content="foobar" />
const toHtml = (tags) => (
  tags.map(({ tagName, attributes, content }) => (
    htmlTag(tagName, attributes, content) )).join(''))


// Arguments that will receive the mapping function:
//
// * dato:  lets you easily access any content stored in your DatoCMS administrative area
//
// * root:  represents the root of your project, and exposes commands to
//          easily create local files/directories
//
// * i18n:  allows to switch the current locale to get back content in
//          alternative locales from the first argument.
//
// Read all the details here:
// https://github.com/datocms/js-datocms-client/blob/master/docs/dato-cli.md

module.exports = (dato, root, i18n) => {

  // Add to the existing Hugo config files some properties coming from data
  // stored on DatoCMS
  ['config.dev.toml', 'config.prod.toml'].forEach(file => {
    root.addToDataFile(file, 'toml', {title: dato.site.globalSeo.siteName,
                                      languageCode: i18n.locale })})

  // Create a YAML data file to store global data about the site
  root.createDataFile('data/settings.yml', 'yaml', {
    name:             dato.site.globalSeo.siteName,
    language:         dato.site.locales[0],
    intro:            dato.home.introText,
    copyright:        dato.home.copyright,
    // iterate over   all the `social_profile` item types
    socialProfiles:   dato.socialProfiles.map( profile => {
                      return {type: profile.profileType.toLowerCase().replace(/ +/, '-'),
                              url: profile.url }}),
    faviconMetaTags:  toHtml(dato.site.faviconMetaTags),
    seoMetaTags:      toHtml(dato.home.seoMetaTags)})


  // Create a markdown file with content coming from the `about_page` item
  // type stored in DatoCMS
  root.createPost(`content/about.md`, 'yaml', {
    frontmatter: {
      title: dato.aboutPage.title,
      subtitle: dato.aboutPage.subtitle,
      photo: dato.aboutPage.photo.url({ w: 800, fm: 'jpg', auto: 'compress' }),
      seoMetaTags: toHtml(dato.aboutPage.seoMetaTags),
      menu: { main: { weight: 100 } }
    },
    content: dato.aboutPage.bio
  });


  // PROJECT
  // ————————————————————————————————

  // Create directory (or empty it if already exists)...
  root.directory('content/project', dir => {
    // ...and for each project stored online...
    dato.projects.forEach((project, index) => {
      // ...create a markdown file with all the metadata in the frontmatter
      dir.createPost(`${project.slug}.md`, 'yaml', {
        frontmatter: {
          title:       project.title,
          images:      project.gallery.map(item => item.url({ w: 800, fm: 'jpg', auto: 'compress' })),
          date:        project.date,
          category:    project.category,
          location:    project.location,
          latlng:      project.latlng,
          size:        project.size,
          weight:      index,
          seoMetaTags: toHtml(project.seoMetaTags) },
        content: project.description }) }) })

  // PROJECT
  // ————————————————————————————————
  root.directory('content/studio', dir => {
    dato.studios.forEach((studio, index) => {
      dir.createPost(`${studio.slug}.md`, 'yaml', {
        frontmatter:  { title:       studio.title,
                        images:      studio.gallery.map(item => item.url({w: 800, 
                                                                          fm: 'jpg', 
                                                                          auto: 'compress'})),
                        date:        studio.date,
                        category:    studio.category,
                        location:    studio.location,
                        latlng:      studio.latlng,
                        size:        studio.size,
                        weight:      index,
                        seoMetaTags: toHtml(studio.seoMetaTags) },
        content:      studio.description }) }) }) 
}
