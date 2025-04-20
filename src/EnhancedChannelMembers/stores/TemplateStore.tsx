import { DanhoStores, DiumStore } from "@stores";

type State = {
	
};

export const TemplateStore = new class TemplateStore extends DiumStore<State> {
	constructor() {
		super({}, 'TemplateStore');
	}
	
	
}

DanhoStores.register(TemplateStore);

export default TemplateStore;