import Vue from 'vue';
import Vuex from 'Vuex';
import { createRenderer } from 'vue-server-renderer';

Vue.use(Vuex);

const CompA = {
    template: '<div></div>',
};

const CompB = {
    template: '<div><comp-a/></div>',
    components: {
        CompA,
    }
};

function createStore() {
    return new Vuex.Store({
        state: () => {},
    });
}


async function renderComponent(Component) {
    const store = createStore();
    const Comp = Vue.extend({
        ...Component,
        store,
    });
    const vm = new Comp({
        propsData: {},
    });
    const renderer = createRenderer();
    const content = await renderer.renderToString(vm);
    const state = vm.$store.state;
    return { content, state };
}

async function trigger() {
    {
        const { content, state } = await renderComponent(CompB);
        console.log(content, state);
    }
    {
        // this one will crash
        const { content, state } = await renderComponent(CompA);
        console.log(content, state);
    }
}

trigger();
