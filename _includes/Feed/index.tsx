
import * as React from 'react';

import { Page, PureComponent } from 'paramorph';

import Tile from '@website/_includes/Tile';
import { Branch as TocBranch } from '@website/_includes/TableOfContents';

export interface Props {
  pages : Page[];
  batchSize ?: number;
  respectLimit ?: boolean;
}
export interface State {
  loaded : number;
  loading : number;
}

const DEFAULT_BATCH_SIZE = 10;

export class Feed extends PureComponent<Props, State> {
  private loadTrigger : HTMLDivElement;

  constructor(props : Props) {
    super(props);

    const { batchSize = Math.max(props.pages.length, DEFAULT_BATCH_SIZE) } = props;

    this.state = {
      loading: batchSize,
      loaded: batchSize,
    };

    this.onScroll = this.onScroll.bind(this);
  }

  componentWillMount() {
    const { paramorph, page } = this.context;
    const { pages, respectLimit = false } = this.props;
    const { loading } = this.state;

    if (respectLimit) {
      // no data fetch needed
      return;
    }
    const firstBatch = pages.slice(0, loading);

    // This will preload first batch of pages on server-side
    // and result in a harmless re-render on client-side.
    paramorph.loadData(page.url, () => {
      return Promise.all(firstBatch.map(page => paramorph.loadPage(page.url)));
    })
    .then(() => {
      this.forceUpdate();
    });
  }

  render() {
    const { paramorph, page } = this.context;
    const { pages, respectLimit = false, ...props } = this.props;
    const { loading, loaded } = this.state;

    if (respectLimit) {
      return <TocBranch pages={ pages } shallow { ...props } />;
    }
    const data = paramorph.data[page.url] as React.ComponentType<{}>[] || [];

    if (data.length > pages.length) {
      throw new Error(`${page.url}: pages.length (${pages.length}) < data.length (${data.length})`);
    }

    return (
      <div>
        { data.map((Content, i) => {
          const page = pages[i];

          return (
            <Tile key={ page.url } page={ page } Content={ Content } />
          );
        }) }
        <div ref={ e => this.loadTrigger = e as HTMLDivElement }>
          { loading !== loaded ? 'Loading...' : null }
        </div>
      </div>
    );
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);

    this.onScroll();
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }

  private onScroll() {
    if (this.needsMoreContent() && !this.isAtEnd()) {
      this.loadNextBatch();
    }
  }

  private needsMoreContent() {
    const { scrollY } = window;

    const offsetTop = this.getOffsetTop(this.loadTrigger);
    return scrollY >= offsetTop;
  }

  private loadNextBatch() {
    const { paramorph, page } = this.context;
    const { pages, batchSize = DEFAULT_BATCH_SIZE } = this.props;
    const { loading, loaded } = this.state;

    if (loading !== loaded) {
      return;
    }

    const nextLoading = Math.min(loading + batchSize, pages.length);
    const batch = pages.slice(loaded, nextLoading);

    const previousData : React.ComponentType<{}>[] = paramorph.data[page.url] || [];
    const dataLoaded = paramorph.loadData<React.ComponentType<{}>[]>(
      page.url,
      () => {
        return Promise.all(batch.map(page => paramorph.loadPage(page.url)))
          .then(newData => previousData.concat(newData))
        ;
      },
    );

    this.setState(
      prev => ({ ...prev, loading: nextLoading }),
      () => {
        dataLoaded.then(() => {
          this.setState(
            prev => ({ ...prev, loaded: nextLoading }),
            this.onScroll,
          );
        });
      },
    );
  }

  private getOffsetTop(elem : HTMLElement) : number {
    const { offsetParent } = elem;

    const parentOffset = (offsetParent ? this.getOffsetTop(offsetParent as HTMLElement) : 0);
    return elem.offsetTop + parentOffset;
  }

  private isAtEnd() {
    const { loading } = this.state;
    const { pages } = this.props;

    return loading === pages.length;
  }
}

export default Feed;

