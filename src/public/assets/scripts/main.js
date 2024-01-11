(()=>{"use strict";var t,e={127:()=>{var t="imageAnnotation",e="videoAnnotation";function n(t,e,n,i,s,o,a,r){var l,u="function"==typeof t?t.options:t;if(e&&(u.render=e,u.staticRenderFns=n,u._compiled=!0),i&&(u.functional=!0),o&&(u._scopeId="data-v-"+o),a?(l=function(t){(t=t||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(t=__VUE_SSR_CONTEXT__),s&&s.call(this,t),t&&t._registeredComponents&&t._registeredComponents.add(a)},u._ssrRegister=l):s&&(l=r?function(){s.call(this,(u.functional?this.parent:this).$root.$options.shadowRoot)}:s),l)if(u.functional){u._injectStyles=l;var d=u.render;u.render=function(t,e){return l.call(e),d(t,e)}}else{var c=u.beforeCreate;u.beforeCreate=c?[].concat(c,l):[l]}return{exports:t,options:u}}const i=n({computed:{id:function(){return this.image.id},uuid:function(){return this.image.uuid},type:function(){return this.image.type},patchPrefix:function(){return this.uuid[0]+this.uuid[1]+"/"+this.uuid[2]+this.uuid[3]+"/"+this.uuid},urlTemplate:function(){return biigle.$require("largo.patchUrlTemplate")}},methods:{getThumbnailUrl:function(){return this.type===e?this.urlTemplate.replace(":prefix",this.patchPrefix).replace(":id","v-".concat(this.id)):this.urlTemplate.replace(":prefix",this.patchPrefix).replace(":id",this.id)}},created:function(){this.type===t?this.showAnnotationRoute=biigle.$require("largo.showImageAnnotationRoute"):this.showAnnotationRoute=biigle.$require("largo.showVideoAnnotationRoute")}},undefined,undefined,!1,null,null,null).exports;const s=n({mixins:[i],props:{_id:{type:String,required:!0},_uuid:{type:String,required:!0},label:{type:Object,required:!0},emptySrc:{type:String,required:!0},_urlTemplate:{type:String,required:!0}},data:function(){return{url:""}},computed:{title:function(){return"Example annotation for label "+this.label.name},src:function(){return this.url||this.emptySrc},image:function(){return{id:this._id,uuid:this._uuid,type:t}},urlTemplate:function(){return this._urlTemplate}},methods:{showEmptyImage:function(){this.url=""}},created:function(){this.url=this.getThumbnailUrl()}},undefined,undefined,!1,null,null,null).exports,o=Vue.resource("api/v1/volumes{/id}/largo",{},{queryImageAnnotations:{method:"GET",url:"api/v1/volumes{/id}/image-annotations/filter/label{/label_id}"},queryVideoAnnotations:{method:"GET",url:"api/v1/volumes{/id}/video-annotations/filter/label{/label_id}"},queryExampleAnnotations:{method:"GET",url:"api/v1/volumes{/id}/image-annotations/examples{/label_id}"},sortAnnotationsByOutlier:{method:"GET",url:"api/v1/volumes{/id}/annotations/sort/outliers{/label_id}"}});var a=biigle.$require("echo"),r=biigle.$require("events"),l=biigle.$require("messages").handleErrorResponse,u=biigle.$require("volumes.components.imageGrid"),d=biigle.$require("volumes.components.imageGridImage"),c=biigle.$require("annotations.components.labelsTabPlugins"),h=biigle.$require("labelTrees.components.labelTrees"),g=biigle.$require("core.mixins.loader"),m=biigle.$require("messages"),f=biigle.$require("core.components.powerToggle"),p=biigle.$require("annotations.components.settingsTabPlugins"),b=biigle.$require("core.components.sidebar"),v=biigle.$require("core.components.sidebarTab");const y=n({mixins:[g],components:{annotationPatch:s},props:{label:{default:null},volumeId:{type:Number,required:!0},count:{type:Number,default:3}},data:function(){return{exampleLabel:null,exampleAnnotations:[],cache:{},shown:!0}},computed:{isShown:function(){return this.shown&&null!==this.label},hasExamples:function(){return this.exampleLabel&&this.exampleAnnotations&&Object.keys(this.exampleAnnotations).length>0}},methods:{parseResponse:function(t){return t.data},setExampleAnnotations:function(t){(!t[0].hasOwnProperty("annotations")||Object.keys(t[0].annotations).length<this.count)&&delete this.cache[t[1]],t[0].hasOwnProperty("label")&&t[0].label.id===t[1]||delete this.cache[t[1]],this.label&&this.label.id===t[1]&&(this.exampleAnnotations=t[0].annotations,this.exampleLabel=t[0].label)},updateShown:function(t){this.shown=t},updateExampleAnnotations:function(){this.exampleAnnotations=[],this.isShown&&(this.startLoading(),this.cache.hasOwnProperty(this.label.id)||(this.cache[this.label.id]=o.queryExampleAnnotations({id:this.volumeId,label_id:this.label.id,take:this.count}).then(this.parseResponse)),Vue.Promise.all([this.cache[this.label.id],this.label.id]).then(this.setExampleAnnotations).finally(this.finishLoading))}},watch:{label:function(){this.updateExampleAnnotations()},shown:function(){this.updateExampleAnnotations()}},created:function(){r.$on("settings.exampleAnnotations",this.updateShown)}},undefined,undefined,!1,null,null,null).exports;c&&(c.exampleAnnotations=y);const A=n({components:{powerButton:f},props:{settings:{type:Object,required:!0}},data:function(){return{isShown:!0}},methods:{hide:function(){this.isShown=!1,this.settings.set("exampleAnnotations",!1)},show:function(){this.isShown=!0,this.settings.delete("exampleAnnotations")}},watch:{isShown:function(t){r.$emit("settings.exampleAnnotations",t)}},created:function(){this.settings.has("exampleAnnotations")&&(this.isShown=this.settings.get("exampleAnnotations"))}},undefined,undefined,!1,null,null,null).exports;p&&(p.exampleAnnotations=A),biigle.$declare("largo.mixins.annotationPatch",i);var w=n({mixins:[d,i],data:function(){return{showAnnotationRoute:null}},computed:{showAnnotationLink:function(){return this.showAnnotationRoute?this.showAnnotationRoute+this.image.id:""}},created:function(){this.type===t?this.showAnnotationRoute=biigle.$require("annotationCatalog.showImageAnnotationRoute"):this.showAnnotationRoute=biigle.$require("annotationCatalog.showVideoAnnotationRoute")}},(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("figure",{staticClass:"image-grid__image image-grid__image--catalog",class:t.classObject},[t.showAnnotationLink?n("a",{attrs:{href:t.showAnnotationLink,target:"_blank",title:"Show the annotation in the annotation tool"}},[n("img",{attrs:{src:t.srcUrl},on:{error:t.showEmptyImage}})]):n("img",{attrs:{src:t.srcUrl},on:{error:t.showEmptyImage}})])}),[],!1,null,null,null);const S=n({mixins:[u],components:{imageGridImage:w.exports}},undefined,undefined,!1,null,null,null).exports,_=Vue.resource("api/v1/labels{/id}",{},{queryImageAnnotations:{method:"GET",url:"api/v1/labels{/id}/image-annotations"},queryVideoAnnotations:{method:"GET",url:"api/v1/labels{/id}/video-annotations"}});var C=n({mixins:[d,i],data:function(){return{showAnnotationRoute:null}},computed:{showAnnotationLink:function(){return this.showAnnotationRoute?this.showAnnotationRoute+this.image.id:""},selected:function(){return this.image.dismissed},title:function(){return this.selected?"Undo dismissing this annotation":"Dismiss this annotation"}}},(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("figure",{staticClass:"image-grid__image",class:t.classObject,attrs:{title:t.title}},[t.selectable?n("div",{staticClass:"image-icon"},[n("i",{staticClass:"fas",class:t.iconClass})]):t._e(),t._v(" "),n("img",{attrs:{src:t.srcUrl},on:{click:t.toggleSelect,error:t.showEmptyImage}}),t._v(" "),t.showAnnotationLink?n("div",{staticClass:"image-buttons"},[n("a",{staticClass:"image-button",attrs:{href:t.showAnnotationLink,target:"_blank",title:"Show the annotation in the annotation tool"}},[n("span",{staticClass:"fa fa-external-link-square-alt fa-fw",attrs:{"aria-hidden":"true"}})])]):t._e()])}),[],!1,null,null,null);const I=n({mixins:[u],components:{imageGridImage:C.exports}},undefined,undefined,!1,null,null,null).exports;var x=n({mixins:[d,i],data:function(){return{showAnnotationRoute:null}},computed:{showAnnotationLink:function(){return this.showAnnotationRoute?this.showAnnotationRoute+this.image.id:""},selected:function(){return this.image.newLabel},title:function(){return this.selected?"Revert changing the label of this annotation":"Change the label of this annotation"},newLabelStyle:function(){return{"background-color":"#"+this.image.newLabel.color}}}},(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("figure",{staticClass:"image-grid__image image-grid__image--relabel",class:t.classObject,attrs:{title:t.title}},[t.selectable?n("div",{staticClass:"image-icon"},[n("i",{staticClass:"fas",class:t.iconClass})]):t._e(),t._v(" "),n("img",{attrs:{src:t.srcUrl},on:{click:t.toggleSelect,error:t.showEmptyImage}}),t._v(" "),t.showAnnotationLink?n("div",{staticClass:"image-buttons"},[n("a",{staticClass:"image-button",attrs:{href:t.showAnnotationLink,target:"_blank",title:"Show the annotation in the annotation tool"}},[n("span",{staticClass:"fa fa-external-link-square-alt",attrs:{"aria-hidden":"true"}})])]):t._e(),t._v(" "),t.selected?n("div",{staticClass:"new-label"},[n("span",{staticClass:"new-label__color",style:t.newLabelStyle}),t._v(" "),n("span",{staticClass:"new-label__name",domProps:{textContent:t._s(t.image.newLabel.name)}})]):t._e()])}),[],!1,null,null,null);const L=n({mixins:[u],components:{imageGridImage:x.exports}},undefined,undefined,!1,null,null,null).exports;var q=0,T=1,$=0,O=1;var D=n({data:function(){return{sortDirection:T,sortKey:$}},computed:{sortedAscending:function(){return this.sortDirection===q},sortedDescending:function(){return this.sortDirection===T},sortingByAnnotationId:function(){return this.sortKey===$},sortingByOutlier:function(){return this.sortKey===O}},methods:{sortAscending:function(){this.sortDirection=q},sortDescending:function(){this.sortDirection=T},reset:function(){this.sortDescending(),this.sortByAnnotationId()},sortByAnnotationId:function(){this.sortKey=$},sortByOutlier:function(){this.sortKey=O}},watch:{sortDirection:function(t){this.$emit("change-direction",t)},sortKey:function(t){this.$emit("change-key",t)}}},(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"sorting-tab"},[n("div",{staticClass:"sorting-tab__buttons"},[n("div",{staticClass:"btn-group",attrs:{role:"group"}},[n("button",{staticClass:"btn btn-default",class:{active:t.sortedDescending},attrs:{type:"button",title:"Sort descending"},on:{click:t.sortDescending}},[n("span",{staticClass:"fa fa-sort-amount-down"})]),t._v(" "),n("button",{staticClass:"btn btn-default",class:{active:t.sortedAscending},attrs:{type:"button",title:"Sort ascending"},on:{click:t.sortAscending}},[n("span",{staticClass:"fa fa-sort-amount-up"})])]),t._v(" "),n("div",{staticClass:"btn-group pull-right",attrs:{role:"group"}},[n("button",{staticClass:"btn btn-default",attrs:{type:"button",title:"Reset sorting"},on:{click:t.reset}},[n("span",{staticClass:"fa fa-times"})])])]),t._v(" "),n("div",{staticClass:"list-group sorter-list-group"},[n("button",{staticClass:"list-group-item",class:{active:t.sortingByAnnotationId},attrs:{title:"Sort by annotation ID (higher is newer)"},on:{click:t.sortByAnnotationId}},[t._v("\n            ID\n        ")]),t._v(" "),n("button",{staticClass:"list-group-item",class:{active:t.sortingByOutlier},attrs:{title:"Sort by outliers (higher is more dissimilar)"},on:{click:t.sortByOutlier}},[t._v("\n            Outliers\n        ")])])])}),[],!1,null,null,null);const k=n({mixins:[g],components:{labelTrees:h,sidebar:b,sidebarTab:v,powerToggle:f,dismissImageGrid:I,relabelImageGrid:L,sortingTab:D.exports},data:function(){return{user:null,labelTrees:[],step:0,selectedLabel:null,annotationsCache:{},lastSelectedImage:null,forceChange:!1,waitForSessionId:null,sortingSequenceCache:{},sortingDirection:T,sortingKey:$}},computed:{isInDismissStep:function(){return 0===this.step},isInRelabelStep:function(){return 1===this.step},annotations:function(){return this.selectedLabel&&this.annotationsCache.hasOwnProperty(this.selectedLabel.id)?this.annotationsCache[this.selectedLabel.id]:[]},sortedAnnotations:function(){var t,e,n,i=this.annotations.slice(),s=null===(t=this.sortingSequenceCache)||void 0===t||null===(e=t[null===(n=this.selectedLabel)||void 0===n?void 0:n.id])||void 0===e?void 0:e[this.sortingKey];if(s){var o={};s.forEach((function(t,e){return o[t]=e})),i.sort((function(t,e){return o[t.id]-o[e.id]}))}return this.sortingDirection===q?i.reverse():i},allAnnotations:function(){var t=[];for(var e in this.annotationsCache)this.annotationsCache.hasOwnProperty(e)&&Array.prototype.push.apply(t,this.annotationsCache[e]);return t},hasNoAnnotations:function(){return this.selectedLabel&&!this.loading&&0===this.annotations.length},dismissedAnnotations:function(){return this.allAnnotations.filter((function(t){return t.dismissed}))},annotationsWithNewLabel:function(){return this.dismissedAnnotations.filter((function(t){return!!t.newLabel}))},hasDismissedAnnotations:function(){return this.dismissedAnnotations.length>0},dismissedImageAnnotationsToSave:function(){return this.packDismissedToSave(this.dismissedAnnotations.filter((function(e){return e.type===t})))},dismissedVideoAnnotationsToSave:function(){return this.packDismissedToSave(this.dismissedAnnotations.filter((function(t){return t.type===e})))},changedImageAnnotationsToSave:function(){return this.packChangedToSave(this.annotationsWithNewLabel.filter((function(e){return e.type===t})))},changedVideoAnnotationsToSave:function(){return this.packChangedToSave(this.annotationsWithNewLabel.filter((function(t){return t.type===e})))},toDeleteCount:function(){return this.dismissedAnnotations.length-this.annotationsWithNewLabel.length},saveButtonClass:function(){return this.forceChange?"btn-danger":"btn-success"},sortingIsActive:function(){return this.isInDismissStep&&(this.sortingKey!==$||this.sortingDirection!==T)}},methods:{getAnnotations:function(t){var e,n,i,s,o=this;this.annotationsCache.hasOwnProperty(t.id)?i=Vue.Promise.resolve():(Vue.set(this.annotationsCache,t.id,[]),this.startLoading(),i=this.queryAnnotations(t).then((function(e){return o.gotAnnotations(t,e)}),l));var a=null===(e=this.sortingSequenceCache)||void 0===e||null===(n=e[t.id])||void 0===n?void 0:n[this.sortingKey];this.sortingIsActive&&!a?(this.loading||this.startLoading(),s=this.fetchSortingSequence(this.sortingKey,t.id).catch(l)):s=Vue.Promise.resolve(),Vue.Promise.all([i,s]).finally(this.finishLoading)},gotAnnotations:function(n,i){var s=i[0].data,o=i[1].data,a=[];s&&(a=a.concat(this.initAnnotations(n,s,t))),o&&(a=a.concat(this.initAnnotations(n,o,e))),a=a.sort((function(t,e){return e.id-t.id})),Vue.set(this.annotationsCache,n.id,a)},initAnnotations:function(t,e,n){return Object.keys(e).map((function(i){return{id:i,uuid:e[i],label_id:t.id,dismissed:!1,newLabel:null,type:n}}))},handleSelectedLabel:function(t){this.selectedLabel=t,this.isInDismissStep&&this.getAnnotations(t)},handleDeselectedLabel:function(){this.selectedLabel=null},handleSelectedImageDismiss:function(t,e){t.dismissed?(t.dismissed=!1,t.newLabel=null):(t.dismissed=!0,e.shiftKey&&this.lastSelectedImage?this.dismissAllImagesBetween(t,this.lastSelectedImage):this.lastSelectedImage=t)},goToRelabel:function(){this.step=1,this.lastSelectedImage=null},goToDismiss:function(){this.step=0,this.lastSelectedImage=null,this.selectedLabel&&this.getAnnotations(this.selectedLabel)},handleSelectedImageRelabel:function(t,e){t.newLabel?this.selectedLabel&&t.newLabel.id!==this.selectedLabel.id?t.newLabel=this.selectedLabel:t.newLabel=null:this.selectedLabel&&(t.newLabel=this.selectedLabel,e.shiftKey&&this.lastSelectedImage?this.relabelAllImagesBetween(t,this.lastSelectedImage):this.lastSelectedImage=t)},save:function(){var t=this;if(!this.loading){if(this.toDeleteCount>0){for(var e;null!==e&&parseInt(e,10)!==this.toDeleteCount;)e=prompt("This might delete ".concat(this.toDeleteCount," annotation(s). Please enter the number to continue."));if(null===e)return}this.startLoading(),this.performSave({dismissed_image_annotations:this.dismissedImageAnnotationsToSave,changed_image_annotations:this.changedImageAnnotationsToSave,dismissed_video_annotations:this.dismissedVideoAnnotationsToSave,changed_video_annotations:this.changedVideoAnnotationsToSave,force:this.forceChange}).then((function(e){return t.waitForSessionId=e.body.id}),(function(e){t.finishLoading(),l(e)}))}},handleSessionSaved:function(t){if(t.id==this.waitForSessionId){for(var e in this.finishLoading(),m.success("Saved. You can now start a new re-evaluation session."),this.step=0,this.annotationsCache)this.annotationsCache.hasOwnProperty(e)&&delete this.annotationsCache[e];for(var n in this.sortingSequenceCache)this.sortingSequenceCache.hasOwnProperty(n)&&delete this.sortingSequenceCache[n];this.handleSelectedLabel(this.selectedLabel)}},handleSessionFailed:function(t){t.id==this.waitForSessionId&&(this.finishLoading(),m.danger("There was an unexpected error."))},performOnAllImagesBetween:function(t,e,n){var i=this.allAnnotations.indexOf(t),s=this.allAnnotations.indexOf(e);if(s<i){var o=s;s=i,i=o}for(var a=i+1;a<s;a++)n(this.allAnnotations[a])},dismissAllImagesBetween:function(t,e){this.performOnAllImagesBetween(t,e,(function(t){t.dismissed=!0}))},relabelAllImagesBetween:function(t,e){var n=this.selectedLabel;this.performOnAllImagesBetween(t,e,(function(t){t.dismissed&&(t.newLabel=n)}))},enableForceChange:function(){this.forceChange=!0},disableForceChange:function(){this.forceChange=!1},packDismissedToSave:function(t){for(var e={},n=t.length-1;n>=0;n--)e.hasOwnProperty(t[n].label_id)?e[t[n].label_id].push(t[n].id):e[t[n].label_id]=[t[n].id];return e},packChangedToSave:function(t){for(var e={},n=t.length-1;n>=0;n--)e.hasOwnProperty(t[n].newLabel.id)?e[t[n].newLabel.id].push(t[n].id):e[t[n].newLabel.id]=[t[n].id];return e},initializeEcho:function(){a.getInstance().private("user-".concat(this.user.id)).listen(".Biigle\\Modules\\Largo\\Events\\LargoSessionSaved",this.handleSessionSaved).listen(".Biigle\\Modules\\Largo\\Events\\LargoSessionFailed",this.handleSessionFailed)},updateSortDirection:function(t){this.sortingDirection=t},fetchSortingSequence:function(t,e){var n=this;return(t===O?this.querySortByOutlier(e).then((function(t){return t.body})):Vue.Promise.resolve([])).then((function(i){return n.putSortingSequenceToCache(t,e,i)}))},putSortingSequenceToCache:function(t,e,n){this.sortingSequenceCache[e]||Vue.set(this.sortingSequenceCache,e,{}),this.sortingSequenceCache[e][t]=n},updateSortKey:function(t){var e,n,i,s=this,o=null===(e=this.selectedLabel)||void 0===e?void 0:e.id,a=null===(n=this.sortingSequenceCache)||void 0===n||null===(i=n[o])||void 0===i?void 0:i[t];o&&!a?(this.startLoading(),this.fetchSortingSequence(t,o).then((function(){return s.sortingKey=t})).catch(l).finally(this.finishLoading)):this.sortingKey=t}},watch:{annotations:function(t){r.$emit("annotations-count",t.length)},dismissedAnnotations:function(t){r.$emit("dismissed-annotations-count",t.length)},step:function(t){r.$emit("step",t)},selectedLabel:function(){this.isInDismissStep&&this.$refs.dismissGrid.setOffset(0)}},created:function(){var t=this;this.user=biigle.$require("largo.user"),window.addEventListener("beforeunload",(function(e){if(t.hasDismissedAnnotations)return e.preventDefault(),e.returnValue="","This page is asking you to confirm that you want to leave - data you have entered may not be saved."})),this.initializeEcho()}},undefined,undefined,!1,null,null,null).exports;const E=n({mixins:[k],components:{catalogImageGrid:S},data:function(){return{labelTrees:[]}},methods:{queryAnnotations:function(t){var e=_.queryImageAnnotations({id:t.id}),n=_.queryVideoAnnotations({id:t.id});return Vue.Promise.all([e,n])}},created:function(){var t=biigle.$require("annotationCatalog.labelTree");this.labelTrees=[t]}},undefined,undefined,!1,null,null,null).exports;const R=n({mixins:[k],data:function(){return{volumeId:null,labelTrees:[],mediaType:""}},methods:{queryAnnotations:function(t){var e,n;return"image"===this.mediaType?(e=o.queryImageAnnotations({id:this.volumeId,label_id:t.id}),n=Vue.Promise.resolve([])):(e=Vue.Promise.resolve([]),n=o.queryVideoAnnotations({id:this.volumeId,label_id:t.id})),Vue.Promise.all([e,n])},performSave:function(t){return o.save({id:this.volumeId},t)},querySortByOutlier:function(t){return o.sortAnnotationsByOutlier({id:this.volumeId,label_id:t})}},created:function(){this.volumeId=biigle.$require("largo.volumeId"),this.labelTrees=biigle.$require("largo.labelTrees"),this.mediaType=biigle.$require("largo.mediaType")}},undefined,undefined,!1,null,null,null).exports;const V=n({data:function(){return{step:0,count:0,dismissedCount:0}},computed:{shownCount:function(){return this.isInDismissStep?this.count:this.dismissedCount},isInDismissStep:function(){return 0===this.step},isInRelabelStep:function(){return 1===this.step}},methods:{updateStep:function(t){this.step=t},updateCount:function(t){this.count=t},updateDismissedCount:function(t){this.dismissedCount=t}},created:function(){r.$on("annotations-count",this.updateCount),r.$on("dismissed-annotations-count",this.updateDismissedCount),r.$on("step",this.updateStep)}},undefined,undefined,!1,null,null,null).exports,P=Vue.resource("api/v1/projects{/id}/largo",{},{queryImageAnnotations:{method:"GET",url:"api/v1/projects{/id}/image-annotations/filter/label{/label_id}"},queryVideoAnnotations:{method:"GET",url:"api/v1/projects{/id}/video-annotations/filter/label{/label_id}"}});const B=n({mixins:[k],data:function(){return{projectId:null,labelTrees:[]}},methods:{queryAnnotations:function(t){var e=P.queryImageAnnotations({id:this.projectId,label_id:t.id}),n=P.queryVideoAnnotations({id:this.projectId,label_id:t.id});return Vue.Promise.all([e,n])},performSave:function(t){return P.save({id:this.projectId},t)}},created:function(){this.projectId=biigle.$require("largo.projectId"),this.labelTrees=biigle.$require("largo.labelTrees")}},undefined,undefined,!1,null,null,null).exports;biigle.$mount("annotation-catalog-container",E),biigle.$mount("largo-container",R),biigle.$mount("largo-title",V),biigle.$mount("project-largo-container",B)},401:()=>{}},n={};function i(t){var s=n[t];if(void 0!==s)return s.exports;var o=n[t]={exports:{}};return e[t](o,o.exports,i),o.exports}i.m=e,t=[],i.O=(e,n,s,o)=>{if(!n){var a=1/0;for(d=0;d<t.length;d++){for(var[n,s,o]=t[d],r=!0,l=0;l<n.length;l++)(!1&o||a>=o)&&Object.keys(i.O).every((t=>i.O[t](n[l])))?n.splice(l--,1):(r=!1,o<a&&(a=o));if(r){t.splice(d--,1);var u=s();void 0!==u&&(e=u)}}return e}o=o||0;for(var d=t.length;d>0&&t[d-1][2]>o;d--)t[d]=t[d-1];t[d]=[n,s,o]},i.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),(()=>{var t={355:0,392:0};i.O.j=e=>0===t[e];var e=(e,n)=>{var s,o,[a,r,l]=n,u=0;if(a.some((e=>0!==t[e]))){for(s in r)i.o(r,s)&&(i.m[s]=r[s]);if(l)var d=l(i)}for(e&&e(n);u<a.length;u++)o=a[u],i.o(t,o)&&t[o]&&t[o][0](),t[o]=0;return i.O(d)},n=self.webpackChunkbiigle_largo=self.webpackChunkbiigle_largo||[];n.forEach(e.bind(null,0)),n.push=e.bind(null,n.push.bind(n))})(),i.O(void 0,[392],(()=>i(127)));var s=i.O(void 0,[392],(()=>i(401)));s=i.O(s)})();