"use strict";(self.webpackChunkportal_ui=self.webpackChunkportal_ui||[]).push([[9193],{49193:function(e,t,n){n.r(t);var r=n(23430),s=(n(50390),n(34424)),o=n(23473),c=n(44149),u=n(21639),i=n(60656),l=n(63548),a=n(62559),f={setErrorSnackMessage:c.Ih},h=(0,s.$j)(null,f);t.default=h((function(e){var t=e.closeDeleteModalAndRefresh,n=e.deleteOpen,s=e.selectedBucket,c=e.selectedObjects,f=e.setErrorSnackMessage,h=(0,u.Z)((function(){return t(!0)}),(function(e){return f(e)})),d=(0,r.Z)(h,2),p=d[0],v=d[1];if(!c)return null;return(0,a.jsx)(i.Z,{title:"Delete Objects",confirmText:"Delete",isOpen:n,titleIcon:(0,a.jsx)(l.Nv,{}),isLoading:p,onConfirm:function(){for(var e=[],t=0;t<c.length;t++)c[t].endsWith("/")?e.push({path:c[t],versionID:"",recursive:!0}):e.push({path:c[t],versionID:"",recursive:!1});e&&v("POST","/api/v1/buckets/".concat(s,"/delete-objects"),e)},onClose:function(){return t(!1)},confirmationContent:(0,a.jsxs)(o.Z,{children:["Are you sure you want to delete the selected ",c.length," ","objects?"," "]})})}))}}]);
//# sourceMappingURL=9193.6764f72b.chunk.js.map