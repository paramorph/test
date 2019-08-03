
import * as React from 'react';

import { Tag, PureComponent, Link } from 'paramorph';

export interface Props {
  children : React.ReactNode;
}

export class DefaultLayout extends PureComponent<Props, {}> {
  render() {
    const { paramorph, post } = this.context;
    const { children } = this.props;

    return (
      <div>
        <div className='header'>
          <nav>
            <ul>
            { paramorph.config.menu.map(entry => (
              <li key={ entry.url }><Link to={ entry.url }>{ entry.short }</Link></li>
            )) }
            </ul>
          </nav>
        </div>
        <div className='main'>
          <main>
            <div className='title'>
              <h1><Link to={ post.url }>{ post.title }</Link></h1>
              <ul className='tags'>
              { post.tags
                .map(title => paramorph.tags[title] as Tag)
                .map(({ title, url } : Tag) => (
                  <li key={ url }><Link to={ url }>{ title }</Link></li>
                )) }
              </ul>
            </div>

            { children }

          </main>
        </div>
        <div className='footer'>
          <nav>
            <ul>
            { paramorph.config.menu.map(entry => (
              <li key={ entry.url }><Link to={ entry.url }>{ entry.short }</Link></li>
            )) }
              <li><Link to='/sitemap/'>Sitemap</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    );
  }
}

export default DefaultLayout;

