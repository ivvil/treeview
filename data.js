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
