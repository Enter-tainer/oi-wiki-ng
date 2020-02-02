import { MDXRenderer } from 'gatsby-plugin-mdx'
import React from 'react'
import Layout from '../components/layout'
import Container from '@material-ui/core/Container';

function Doc({ data: { doc }, location }) {
  const headingTitle = doc.headings[0] && doc.headings[0].value
  const title = doc.slug === '/' ? null : doc.title || headingTitle
  const description = doc.description || doc.excerpt
  const authors = doc.parent.frontmatter.author || null
  const tags = doc.parent.frontmatter.tags || null
  const toc = doc.parent.toc || null

  return (
    <Layout location={location} authors={authors} title={title} description={description} tags={tags} toc={toc}>
      <Container maxWidth="sm">
        <MDXRenderer>{doc.body}</MDXRenderer>
      </Container>
    </Layout>
  )
}

export default Doc
