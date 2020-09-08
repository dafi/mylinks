export interface Theme {
  backgroundImage?: string;
  missingFavIconColor: string,
  linkKeyBackground?: string;
  linkKeyColor?: string;
}

export interface Link {
  id: string;
  label: string;
  url: string;
  favicon?: string;
  shortcut?: string;
  widget?: Widget;
}

export interface Widget {
  id: string;
  title: string;
  list: [Link];
}

export interface MyLinks {
  theme: Theme;
  columns: [Widget[]];
}

export function openAllLinks(wd: Widget) {
  wd.list.reverse().forEach(openLink);
}

export function openLink(link: Link) {
  window.open(link.url)
}

export function filterMyLinks(myLinks: MyLinks, callback: (widget: Widget, link: Link) => boolean) : Link[] {
  const result: Link[] = [];
  myLinks.columns.forEach(row => {
    row.forEach(widgets => {
      widgets.list
        .forEach(item => {
          if (callback(widgets, item)) {
            result.push(item);
          }
        });
    })
  });
  return result;
}

export function someMyLinks(myLinks: MyLinks, callback: (widget: Widget, link: Link) => boolean) {
  return myLinks.columns.some(row => {
    return row.some(widget => {
      return widget.list.some(link => {
        return callback(widget, link);
      })
    })
  })
}


export class MyLinksHolder {

  constructor(public readonly myLinks: MyLinks) {
    this.attachWidgetTolinks();
  }

  private attachWidgetTolinks() {
    this.myLinks.columns.flat().forEach(w => {
      w.list.forEach(l => {
        l.widget = w;
      })
    });
  }

  findWidgetById(id: string) {
    return this.myLinks.columns.flat().find(w => w.id === id);
  }

  hasShortcuts(): boolean {
    return someMyLinks(this.myLinks, (w, l) => !!l.shortcut);
  }

  applyBackground() {
    const bkg = this.myLinks.theme?.backgroundImage;
    const body = document.body;
    if (bkg) {
      body.style.backgroundImage = `url(${bkg})`;
    } else {
      body.style.backgroundImage = '';
    }
  }

  applyTheme() {
    const theme = this.myLinks.theme;

    if (!theme) {
      return;
    }

    MyLinksHolder.setColor('--missing-favicon-color', theme.missingFavIconColor);
    MyLinksHolder.setColor('--link-key-background', theme.linkKeyBackground);
    MyLinksHolder.setColor('--link-key-color', theme.linkKeyColor);
  }

  private static setColor(property: string, color?: string) {
    if (color) {
      document.documentElement.style.setProperty(property, color);
    } else {
      document.documentElement.style.removeProperty(property);
    }
  }
}
