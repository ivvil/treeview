export { Page, PageGraph };

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

  /**
   * Adds a link between two pages in the graph.
   * @param {string} sourceId - The ID of the source page.
   * @param {string} targetId - The ID of the target page.
   * @throws {Error} If either the source or target page does not exist.
   */
  addLink(sourceId, targetId) {
	const sourcePage = this.pages.get(sourceId);
	const targetPage = this.pages.get(targetId);

	if (!sourcePage || !targetPage) {
	  throw new Error("Both pages must exist to create a link.");
	}

	sourcePage.addLink(targetPage);
  }

  /**
   * Deserializes JSON into a PageGraph instance.
   * @param {JSON} pageData - The JSON representation of the graph.
   * @returns {PageGraph} The deserialized PageGraph instance.
   * @throws {Error} If the JSON is invalid or cannot be parsed.
   */
  static deserialize(pageData) {
	const pageGraph = new PageGraph;

	for (let { id, name } of pageData) {
	  pageGraph.addPage(id, name);
	}
	
	for (let { id, links } of pageData) {
	  for(let linkId of links) {
		pageGraph.addLink(id, linkId)
	  }
	}

	return pageGraph;
  }

}
