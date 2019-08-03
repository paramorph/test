
import * as React from 'react';

import { Post, PureComponent, Link, ContextTypes } from 'paramorph';

export interface Props {
  post : Post;
  Content : React.ComponentType<any>;
}

export class Tile extends PureComponent<Props, {}> {
  static readonly childContextTypes = ContextTypes;

  getChildContext() {
    const { post } = this.props;

    return {
      ...this.context,
      post,
    }
  }

  render() {
    const { post, Content, ...props } = this.props;

    return (
      <article>
        <h1><Link to={ post.url }>{ post.title }</Link></h1>

        <Content respectLimit={ true } />
        <p>
          <Link to={ post.url }>Read More</Link>
        </p>
      </article>
    );
  }
}

export default Tile;

function maybeRenderImage(post : Post) {
  if (!post.image) {
    return null;
  }
  return (
    <p>
      <Link to={ post.url }>
        <img src={ post.image } alt={ post.title } />
      </Link>
    </p>
  );
}

