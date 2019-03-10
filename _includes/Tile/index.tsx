
import * as React from 'react';

import { Page, PureComponent, Link, ContextTypes } from 'paramorph';

export interface Props {
  page : Page;
  Content : React.ComponentType<any>;
}

export class Tile extends PureComponent<Props, {}> {
  static readonly childContextTypes = ContextTypes;

  getChildContext() {
    const { page } = this.props;

    return {
      ...this.context,
      page,
    }
  }

  render() {
    const { page, Content, ...props } = this.props;

    return (
      <article>
        <h1><Link to={ page.url }>{ page.title }</Link></h1>

        <Content respectLimit={ true } />
        <p>
          <Link to={ page.url }>Read More</Link>
        </p>
      </article>
    );
  }
}

export default Tile;

function maybeRenderImage(page : Page) {
  if (!page.image) {
    return null;
  }
  return (
    <p>
      <Link to={ page.url }>
        <img src={ page.image } alt={ page.title } />
      </Link>
    </p>
  );
}

