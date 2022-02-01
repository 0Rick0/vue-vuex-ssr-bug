# Vue Vuex SSR Bug
In short, `vm.$store` is `undefined` when the root component of the current vm was previously used as a child component in another vm.

## Components
In this test there are two components, CompA and CompB.

CompA:
```vue
<template>
    <div></div>
</template>
<script>
export default {};
</script>
```
CompB:
```vue
<template>
    <div>
        <comp-a/>
    </div>
</template>
<script>
export default {
    components: {
        CompA,
    },
};
</script>
```
## Store
The store is created using this function
```javascript
function createStore() {
    return new Vuex.Store({
        state: () => {},
    });
}
```

## Rendering
The rendering is insipred by the renderVuex implementation of hypernova-vue.
https://github.com/ara-framework/hypernova-vue/blob/master/src/server.ts#L38

```javascript
function renderComponent(Component) {
    const store = createStore();
    const Comp = Vue.extend({
        ...Component,
        store,
    });
    const vm = new Comp({
        propsData: {},
    });
    const renderer = createRenderer();
    const content = renderer.renderToString(vm);
    const state = vm.$store.state;
    return { content, state };
}
```

## Bug
The bug appears when first CompB is rendered, and then CompA is rendered.

It appears that no `vm.$store` is defined when a component has previously been used as a child component.

## Mitigation
Wrap CompA in another component so it is never used as a root component.
Ensure that no root component is ever used as a child component.
