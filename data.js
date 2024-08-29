export { PageTree };

class PageTree {
  indexId;
  pages;
  
  constructor(indexId, pages) {
	this.indexId = indexId;
	this.pages = this.#getIdMap(pages);

	if (!this.pages.has(indexId)) {
	  throw new Error("A valid indexId must be provided");
	}
  }

  #getIdMap(pages) {
	const map = new Map();
	
	for(let page of pages) {
	  if (typeof(page.id) != "undefined") {
		map.set(page.id, page);
	  } else {
		console.warn("The page", page, "doesn't contain an id, skipping");
	  }
	}

	return map;
  }

  getIndex() {
	return this.pages.get(this.indexId);
  }

  static fromJSON(json) {
	let obj = typeof json === 'string' ? JSON.parse(json) : json;
	
	const index = obj.find(page => page.isIndex === true);

	return new PageTree(index.id, obj);
  }

  
}

class Page {
  
  /**
   * Creates a new Page instance.
   * @param {string} id - The unique identifier of the page.
   * @param {string} name - The name of the page.
   */
  constructor(id, name) {
	
	/**
     * The unique identifier of the page.
     * @type {string}
     */
    this.id = id;

	/**
	 * Display name of the page.
	 * @type {string}
	 */
	this.name = name;

	/**
	 * Links that point outiside of this page
	 * @type {Set<Page>}
	 */
	this.links = new Set();    
  }

  /**
   * Adds a link from this page to another page.
   * @param {Page} page - The page to link to.
   */
  addLink(page) {
	this.links.add(page);
  }
}

class PageGraph {

  /**
   * Creates a PageGraph instance
   */
  constructor() {

	/**
     * A map of pages, keyed by their ID.
     * @type {Map<string, Page>}
     */
    this.pages = new Map();    
  }

  /**
   * Adds a new page to the graph 
   */
  addPage(id, name) {
	if (this.pages.has(id)) {
	  throw new Error(`Page with ID ${id} already exists.`);
	}

	const page = new Page(id, name);
	this.pages.set(id, page);
  }

  addLink(sourceId, targetId) {
	const sourcePage = this.pages.get(sourceId);
	const targetPage = this.pages.get(targetId);

	if (!sourcePage || !targetPage) {
	  throw new Error("Both pages must exist to create a link.");
	}

	sourcePage.addLink(targetPage);
  }

}
