
import * as React from 'react';

import { Paramorph, Post, Category, Tag, Link, PureComponent } from 'paramorph';

export interface Props {
  respectLimit ?: boolean;
};

export class TableOfContents extends PureComponent<Props, {}> {
  render() {
    const { respectLimit = false } = this.props;
    const { paramorph } = this.context;

    const topLevel = Object.keys(paramorph.posts)
      .map(key => paramorph.posts[key] as Post)
      .filter(post => post.categories.length == 0)
      .filter(post => post.url != '/')
      .filter(post => !(post instanceof Tag))
    ;
    const tags = Object.keys(paramorph.tags)
      .map(key => paramorph.tags[key]);

    return (
      <ul>
        <li key={ '/' }>
          <Link to='/'>{ (paramorph.posts['/'] as Post).title }</Link>
          <Branch posts={ topLevel } shallow={ respectLimit } ellipsis={ respectLimit } />
        </li>
      {
        !respectLimit
        ? tags.map(({ title, url, posts }: Tag) => (
        <li key={ url }>
          <Link to={ url }>{ title }</Link>
          <Branch posts={ posts } shallow />
        </li>
        ))
        : null
      }
      </ul>
    );
  }
}

export default TableOfContents;

export interface BranchProps {
  posts : Post[];
  shallow ?: boolean;
  ellipsis ?: boolean;
}

export function Branch({
  posts,
  shallow = false,
  ellipsis = false
} : BranchProps) : React.ReactElement<any> {

  const output = posts.filter(post => post.output);
  const categories = output.filter(post => post instanceof Category) as Category[];
  const notCategories = output.filter(post => !(post instanceof Category));

  return (
    <ul>
  {
    categories.map(({ url, title, posts } : Category) => (
      <li key={ url }>
        <Link to={ url }>{ title }</Link>
        { !shallow ? <Branch posts={ posts } /> : null }
      </li>
    ))
  }
  {
    notCategories.map(({ title, url } : Post) => (
      <li key={ url }>
        <Link to={ url }>{ title }</Link>
      </li>
    ))
  }
  { ellipsis ? <li key='ellipsis'>…</li> : null }
    </ul>
  );
}

