angular.module("dias.ate",["dias.transects"]),angular.module("dias.ate").config(["$compileProvider",function(e){"use strict";e.debugInfoEnabled(!1)}]),angular.module("dias.ate").directive("ateFigure",function(){"use strict";return{restrict:"A",controller:["$scope","annotations","msg",function(e,n,t){e.changedLabel=null;var i=function(){e.changedLabel=n.getChangedLabel(e.id)},s=function(){return n.isDismissed(e.id)},a=function(){return null!==e.changedLabel};e.isChanged=a,e.handleClick=function(t){n.selectAnnotation(e.id),i()},e.getTitle=function(){return e.isInDismissMode()?s()?"Undo dismissing this annotation":"Dismiss this annotation":a()?"Revert changing the label of this annotation":"Change the label of this annotation"},e.getClass=function(){return{"annotation-selected":e.isInDismissMode()&&s()||e.isInReLabellingMode()&&a()}},i()}]}}),angular.module("dias.ate").controller("AteController",["$scope","labels","annotations","msg",function(e,n,t,i){"use strict";var s=0,a={DISMISS:0,RELABEL:1},o=function(){document.getElementById("dismiss-mode-title").classList.toggle("ng-hide"),document.getElementById("re-labelling-mode-title").classList.toggle("ng-hide")};e.annotationsExist=t.exist,e.isInDismissMode=function(){return s===a.DISMISS},e.goToDismiss=function(){s=a.DISMISS,o(),t.goToStep(s)},e.isInReLabellingMode=function(){return s===a.RELABEL},e.goToReLabelling=function(){s=a.RELABEL,o(),t.goToStep(s)},e.saveReLabelling=function(){t.save().then(function(){e.goToDismiss(),i.success("Saved. You can now start a new re-evaluation session.")})},e.hasSelectedLabel=n.hasSelectedLabel,e.getSelectedLabelName=function(){return n.getSelectedLabel().name},e.isLoading=t.isLoading,e.isSaving=t.isSaving,e.canContinue=t.canContinue,e.getClass=function(){return{"dismiss-mode":e.isInDismissMode(),"re-labelling-mode":e.isInReLabellingMode()}},e.$watch(n.getSelectedLabel,t.handleSelectedLabel)}]),angular.module("dias.ate").factory("Ate",["$resource","URL",function(e,n){"use strict";return e(n+"/api/v1/transects/:transect_id/ate")}]),angular.module("dias.ate").factory("TransectFilterAnnotationLabel",["$resource","URL",function(e,n){"use strict";return e(n+"/api/v1/transects/:transect_id/annotations/filter/label/:label_id")}]),angular.module("dias.ate").service("annotations",["ATE_TRANSECT_ID","TRANSECT_IMAGES","TransectFilterAnnotationLabel","Ate","labels","images","msg",function(e,n,t,i,s,a,o){"use strict";var l={},r=!1,u=!1,c=!1,d={},g=[],f={},h=0,L={DISMISS:0,RELABEL:1},b=this,S=document.getElementById("annotation-count"),m=function(e){e=e||n.length,S.innerHTML=e},p=function(e){-1===g.indexOf(e)&&g.push(e)},I=function(e){var n=g.indexOf(e);-1!==n&&g.splice(n,1),f.hasOwnProperty(e)&&delete f[e]},v=function(e){u=!1,o.responseError(e)},E=function(){c=!1,l={},d={},g.length=0,f={}},A=function(e){c=!1,y(),o.responseError(e)},T=function(e){u=!1,r=e.length>0,r&&Array.prototype.push.apply(n,e),a.updateFiltering(),m()},D=function(e){var n=s.getSelectedLabel().id;if(d.hasOwnProperty(n)){var t=d[n].indexOf(e);-1!==t?(d[n].splice(t,1),I(e)):(d[n].push(e),p(e))}else d[n]=[e],p(e)},R=function(e){f.hasOwnProperty(e)?delete f[e]:f[e]=s.getSelectedLabel().id},y=function(){n.length=0,T(g),a.scrollToPercent(0)};this.selectAnnotation=function(e){h===L.DISMISS?D(e):R(e)},this.isDismissed=function(e){var n=s.getSelectedLabel().id;return d.hasOwnProperty(n)&&-1!==d[n].indexOf(e)},this.getDismissedIds=function(){return g},this.getChangedLabel=function(e){return f.hasOwnProperty(e)?s.getLabel(f[e]):null},this.handleSelectedLabel=function(i){if(i&&h!==L.RELABEL){var s=i.id;n.length=0,m(),a.updateFiltering(),a.scrollToPercent(0),l.hasOwnProperty(s)?T(l[s]):(u=!0,l[s]=t.query({transect_id:e,label_id:s},T,v))}},this.exist=function(){return r},this.isLoading=function(){return u},this.isSaving=function(){return c},this.canContinue=function(){return g.length>0},this.goToStep=function(e){h=e,h===L.DISMISS?b.handleSelectedLabel(s.getSelectedLabel()):y()},this.save=function(){return c=!0,n.length=0,m(),a.updateFiltering(),i.save({transect_id:e},{dismissed:d,changed:f},E,A).$promise}}]),angular.module("dias.ate").service("labels",["LABEL_TREES",function(e){"use strict";var n=[],t={},i=[],s=null,a=function(){for(var i,s=function(e){var n=e.parent_id;t[i][n]?t[i][n].push(e):t[i][n]=[e]},a=e.length-1;a>=0;a--)i=e[a].name,t[i]={},e[a].labels.forEach(s),n=n.concat(e[a].labels)},o=function(e){for(var t=n.length-1;t>=0;t--)if(n[t].id===e)return n[t];return null},l=function(e){var n=e;if(i.length=0,n)for(;null!==n.parent_id;)i.unshift(n.parent_id),n=o(n.parent_id)};this.getLabel=o,this.getLabels=function(){return n},this.getLabelTrees=function(){return t},this.selectLabel=function(e){l(e),s=e},this.treeItemIsOpen=function(e){return-1!==i.indexOf(e.id)},this.treeItemIsSelected=function(e){return s&&s.id===e.id},this.getSelectedLabel=function(){return s},this.hasSelectedLabel=function(){return null!==s},a()}]);