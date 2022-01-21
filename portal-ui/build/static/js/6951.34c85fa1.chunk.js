"use strict";(self.webpackChunkportal_ui=self.webpackChunkportal_ui||[]).push([[6951],{95239:function(e,t,o){o.r(t);var n=o(23430),r=o(18489),a=o(50390),i=o(34424),s=o(66946),l=o(86509),c=o(4285),d=o(25594),u=o(72462),m=o(44149),f=o(30324),p=o(76352),g=o(67754),x=o(63548),h=o(70014),b=o(62559);(0,l.Z)((0,r.Z)((0,r.Z)({},u.ID),u.bK));var Z=(0,i.$j)(null,{setModalErrorSnackMessage:m.zb});t.default=(0,c.Z)((function(e){return(0,l.Z)((0,r.Z)((0,r.Z)({codeMirrorContainer:{marginBottom:20,paddingLeft:15,"& label":{marginBottom:".5rem"},"& label + div":{display:"none"}}},u.ID),u.bK))}))(Z((function(e){var t=e.classes,o=e.open,r=e.bucketName,i=e.actualPolicy,l=e.actualDefinition,c=e.closeModalAndRefresh,u=e.setModalErrorSnackMessage,m=(0,a.useState)(!1),Z=(0,n.Z)(m,2),v=Z[0],C=Z[1],j=(0,a.useState)(""),y=(0,n.Z)(j,2),k=y[0],S=y[1],M=(0,a.useState)(""),B=(0,n.Z)(M,2),N=B[0],w=B[1];return(0,a.useEffect)((function(){S(i),w(l?JSON.stringify(JSON.parse(l),null,4):"")}),[S,i,w,l]),(0,b.jsx)(p.Z,{title:"Change Access Policy",modalOpen:o,onClose:function(){c()},titleIcon:(0,b.jsx)(x.QX,{}),children:(0,b.jsx)("form",{noValidate:!0,autoComplete:"off",onSubmit:function(e){e.preventDefault(),v||(C(!0),f.Z.invoke("PUT","/api/v1/buckets/".concat(r,"/set-policy"),{access:k,definition:N}).then((function(e){C(!1),c()})).catch((function(e){C(!1),u(e)})))},children:(0,b.jsxs)(d.ZP,{container:!0,children:[(0,b.jsxs)(d.ZP,{item:!0,xs:12,className:t.modalFormScrollable,children:[(0,b.jsx)(d.ZP,{item:!0,xs:12,className:t.formFieldRow,children:(0,b.jsx)(g.Z,{value:k,label:"Access Policy",id:"select-access-policy",name:"select-access-policy",onChange:function(e){S(e.target.value)},options:[{value:"PRIVATE",label:"Private"},{value:"PUBLIC",label:"Public"},{value:"CUSTOM",label:"Custom"}]})}),"CUSTOM"===k&&(0,b.jsx)(d.ZP,{item:!0,xs:12,className:t.codeMirrorContainer,children:(0,b.jsx)(h.Z,{label:"Write Policy",value:N,onBeforeChange:function(e,t,o){w(o)},editorHeight:"350px"})})]}),(0,b.jsxs)(d.ZP,{item:!0,xs:12,className:t.modalButtonBar,children:[(0,b.jsx)(s.Z,{type:"button",variant:"outlined",color:"primary",onClick:function(){c()},disabled:v,children:"Cancel"}),(0,b.jsx)(s.Z,{type:"submit",variant:"contained",color:"primary",disabled:v||"CUSTOM"===k&&!N,children:"Set"})]})]})})})})))},70014:function(e,t,o){var n=o(35531),r=o(23430),a=o(18489),i=o(50390),s=o(25594),l=(o(2574),o(20704)),c=o(54880),d=o(21563),u=o(36297),m=o(14602),f=o(94187),p=o(56805),g=o(86509),x=o(4285),h=o(97538),b=o(72462),Z=o(63548),v=o(53224),C=o(33034),j=o.n(C),y=o(53357),k=o(62559),S={json:d.AV,yaml:function(){return c.i.define(u.r)}},M=y.tk.theme({"&":{backgroundColor:"#FBFAFA"},".cm-content":{caretColor:"#05122B"},"&.cm-focused .cm-cursor":{borderLeftColor:"#05122B"},".cm-gutters":{backgroundColor:"#FBFAFA",color:"#000000",border:"none"},".cm-gutter.cm-foldGutter":{borderRight:"1px solid #eaeaea"},".cm-gutterElement":{fontSize:"13px"},".cm-line":{fontSize:"13px",color:"#2781B0","& .\u037cc":{color:"#C83B51"}},"& .\u037cb":{color:"#2781B0"},".cm-activeLine":{backgroundColor:"#dde1f1"},".cm-matchingBracket":{backgroundColor:"#05122B",color:"#ffffff"},".cm-selectionMatch":{backgroundColor:"#ebe7f1"},".cm-selectionLayer":{fontWeight:500}," .cm-selectionBackground":{backgroundColor:"#a180c7",color:"#ffffff"}},{dark:!1}),B=y.tk.theme({"&":{backgroundColor:"#282a36",color:"#ffb86c"},".cm-gutter.cm-foldGutter":{borderRight:"1px solid #eaeaea"},".cm-gutterElement":{fontSize:"13px"},".cm-line":{fontSize:"13px","& .\u037cd, & .\u037cc":{color:"#8e6cef"}},"& .\u037cb":{color:"#2781B0"},".cm-activeLine":{backgroundColor:"#44475a"},".cm-matchingBracket":{backgroundColor:"#842de5",color:"#ff79c6"},".cm-selectionLayer .cm-selectionBackground":{backgroundColor:"green"}},{dark:!0});t.Z=(0,x.Z)((function(e){return(0,g.Z)((0,a.Z)({},b.YI))}))((function(e){var t=e.value,o=e.label,a=void 0===o?"":o,c=e.tooltip,d=void 0===c?"":c,u=e.mode,g=void 0===u?"json":u,x=e.classes,b=e.onBeforeChange,C=e.readOnly,y=void 0!==C&&C,N=e.editorHeight,w=void 0===N?"250px":N,I=(0,i.useState)(!1),P=(0,r.Z)(I,2),E=P[0],L=P[1],O=[];return S[g]&&(O=[].concat((0,n.Z)(O),[S[g]()])),(0,k.jsxs)(i.Fragment,{children:[(0,k.jsxs)(m.Z,{className:x.inputLabel,children:[(0,k.jsx)("span",{children:a}),""!==d&&(0,k.jsx)("div",{className:x.tooltipContainer,children:(0,k.jsx)(f.Z,{title:d,placement:"top-start",children:(0,k.jsx)("div",{className:x.tooltip,children:(0,k.jsx)(h.Z,{})})})})]}),(0,k.jsx)(s.ZP,{item:!0,xs:12,children:(0,k.jsx)("br",{})}),(0,k.jsxs)(s.ZP,{item:!0,xs:12,sx:{border:"1px solid #eaeaea"},children:[(0,k.jsx)(s.ZP,{item:!0,xs:12,children:(0,k.jsx)(l.ZP,{value:t,theme:E?B:M,extensions:O,editable:!y,basicSetup:!0,height:w,onChange:function(e,t){b(null,null,e)}})}),(0,k.jsx)(s.ZP,{item:!0,xs:12,sx:{borderTop:"1px solid #eaeaea",background:E?"#282c34":"#f7f7f7"},children:(0,k.jsxs)(p.Z,{sx:{display:"flex",alignItems:"center",padding:"2px",paddingRight:"5px",justifyContent:"flex-end","& button":{height:"26px",width:"26px",padding:"2px"," .min-icon":{marginLeft:"0"}}},children:[(0,k.jsx)(v.Z,{tooltip:"Change theme",onClick:function(){L(!E)},text:"",icon:(0,k.jsx)(Z.EO,{}),color:"primary",variant:"outlined"}),(0,k.jsx)(j(),{text:t,children:(0,k.jsx)(v.Z,{tooltip:"Copy to Clipboard",onClick:function(){},text:"",icon:(0,k.jsx)(Z.TI,{}),color:"primary",variant:"outlined"})})]})})]})]})}))},67754:function(e,t,o){var n=o(18489),r=o(50390),a=o(25594),i=o(46413),s=o(14602),l=o(94187),c=o(47554),d=o(43965),u=o(31680),m=o(86509),f=o(4285),p=o(72462),g=o(97538),x=o(62559),h=(0,f.Z)((function(e){return(0,m.Z)({root:{height:38,lineHeight:1,"label + &":{marginTop:e.spacing(3)}},input:{height:38,position:"relative",color:"#07193E",fontSize:13,fontWeight:600,padding:"8px 20px 10px 10px",border:"#e5e5e5 1px solid",borderRadius:4,display:"flex",alignItems:"center","&:hover":{borderColor:"#393939"},"&:focus":{backgroundColor:"#fff"}}})}))(i.ZP);t.Z=(0,f.Z)((function(e){return(0,m.Z)((0,n.Z)((0,n.Z)({},p.YI),p.Hr))}))((function(e){var t=e.classes,o=e.id,n=e.name,i=e.onChange,m=e.options,f=e.label,p=e.tooltip,b=void 0===p?"":p,Z=e.value,v=e.disabled,C=void 0!==v&&v;return(0,x.jsx)(r.Fragment,{children:(0,x.jsxs)(a.ZP,{item:!0,xs:12,className:t.fieldContainer,children:[""!==f&&(0,x.jsxs)(s.Z,{htmlFor:o,className:t.inputLabel,children:[(0,x.jsx)("span",{children:f}),""!==b&&(0,x.jsx)("div",{className:t.tooltipContainer,children:(0,x.jsx)(l.Z,{title:b,placement:"top-start",children:(0,x.jsx)("div",{className:t.tooltip,children:(0,x.jsx)(g.Z,{})})})})]}),(0,x.jsx)(c.Z,{fullWidth:!0,children:(0,x.jsx)(d.Z,{id:o,name:n,value:Z,onChange:i,input:(0,x.jsx)(h,{}),disabled:C,children:m.map((function(e){return(0,x.jsx)(u.Z,{value:e.value,children:e.label},"select-".concat(n,"-").concat(e.label))}))})})]})})}))},76352:function(e,t,o){o.d(t,{Z:function(){return B}});var n,r=o(23430),a=o(18489),i=o(50390),s=o(34424),l=o(95467),c=o(97771),d=o(84402),u=o(78426),m=o(93085),f=o(86509),p=o(4285),g=o(72462),x=o(44149),h=o(38342),b=o.n(h),Z=o(92125),v=o(19538),C=o(21278),j=o(62559),y=function(){clearInterval(n)},k={displayErrorMessage:x.zb},S=(0,s.$j)((function(e){return{modalSnackMessage:e.system.modalSnackBar}}),k)((0,p.Z)((function(e){return(0,f.Z)({modalErrorContainer:{position:"absolute",marginTop:10,width:"80%",backgroundColor:"#fff",border:"#C72C48 1px solid",borderLeftWidth:12,borderRadius:3,zIndex:1e3,padding:"10px 15px",left:"50%",transform:"translateX(-50%)",opacity:0,transitionDuration:"0.2s"},modalErrorShow:{opacity:1},closeButton:{position:"absolute",right:5,fontSize:"small",border:0,backgroundColor:"#fff",cursor:"pointer"},errorTitle:{display:"flex",alignItems:"center"},errorLabel:{color:"#000",fontSize:18,fontWeight:500,marginLeft:5,marginRight:25},messageIcon:{color:"#C72C48",display:"flex","& svg":{width:32,height:32}},detailsButton:{color:"#9C9C9C",display:"flex",alignItems:"center",border:0,backgroundColor:"transparent",paddingLeft:5,fontSize:14,transformDuration:"0.3s",cursor:"pointer"},extraDetailsContainer:{fontStyle:"italic",color:"#9C9C9C",lineHeight:0,padding:"0 10px",transition:"all .2s ease-in-out",overflow:"hidden"},extraDetailsOpen:{lineHeight:1,padding:"3px 10px"},arrowElement:{marginLeft:-5},arrowOpen:{transform:"rotateZ(90deg)",transformDuration:"0.3s"}})}))((function(e){var t=e.classes,o=e.modalSnackMessage,a=e.displayErrorMessage,s=e.customStyle,l=(0,i.useState)(!1),c=(0,r.Z)(l,2),d=c[0],u=c[1],m=(0,i.useState)(!1),f=(0,r.Z)(m,2),p=f[0],g=f[1],x=(0,i.useCallback)((function(){g(!1)}),[]);(0,i.useEffect)((function(){p||(a({detailedError:"",errorMessage:""}),u(!1))}),[a,p]),(0,i.useEffect)((function(){""!==o.message&&"error"===o.type&&g(!0)}),[x,o.message,o.type]);var h=b()(o,"message",""),k=b()(o,"detailedErrorMsg","");return"error"!==o.type||""===h?null:(0,j.jsx)(i.Fragment,{children:(0,j.jsxs)("div",{className:"".concat(t.modalErrorContainer," ").concat(p?t.modalErrorShow:""),style:s,onMouseOver:y,onMouseLeave:function(){n=setInterval(x,1e4)},children:[(0,j.jsx)("button",{className:t.closeButton,onClick:x,children:(0,j.jsx)(C.Z,{})}),(0,j.jsxs)("div",{className:t.errorTitle,children:[(0,j.jsx)("span",{className:t.messageIcon,children:(0,j.jsx)(v.Z,{})}),(0,j.jsx)("span",{className:t.errorLabel,children:h})]}),""!==k&&(0,j.jsxs)(i.Fragment,{children:[(0,j.jsx)("div",{className:t.detailsContainerLink,children:(0,j.jsxs)("button",{className:t.detailsButton,onClick:function(){u(!d)},children:["Details",(0,j.jsx)(Z.Z,{className:"".concat(t.arrowElement," ").concat(d?t.arrowOpen:"")})]})}),(0,j.jsx)("div",{className:"".concat(t.extraDetailsContainer," ").concat(d?t.extraDetailsOpen:""),children:k})]})]})})}))),M=(0,s.$j)((function(e){return{modalSnackMessage:e.system.modalSnackBar}}),{setModalSnackMessage:x.MK}),B=(0,p.Z)((function(e){return(0,f.Z)((0,a.Z)((0,a.Z)({},g.Qw),{},{root:{"& .MuiPaper-root":{padding:"1rem 2rem 2rem 1rem"}},content:{padding:25,paddingBottom:0},customDialogSize:{width:"100%",maxWidth:765}},g.sN))}))(M((function(e){var t=e.onClose,o=e.modalOpen,n=e.title,s=e.children,f=e.classes,p=e.wideLimit,g=void 0===p||p,x=e.modalSnackMessage,h=e.noContentPadding,b=e.setModalSnackMessage,Z=e.titleIcon,v=void 0===Z?null:Z,y=(0,i.useState)(!1),k=(0,r.Z)(y,2),M=k[0],B=k[1];(0,i.useEffect)((function(){b("")}),[b]),(0,i.useEffect)((function(){if(x){if(""===x.message)return void B(!1);"error"!==x.type&&B(!0)}}),[x]);var N=g?{classes:{paper:f.customDialogSize}}:{maxWidth:"lg",fullWidth:!0},w="";return x&&(w=x.detailedErrorMsg,(""===x.detailedErrorMsg||x.detailedErrorMsg.length<5)&&(w=x.message)),(0,j.jsxs)(d.Z,(0,a.Z)((0,a.Z)({open:o,classes:f},N),{},{scroll:"paper",onClose:function(e,o){"backdropClick"!==o&&t()},className:f.root,children:[(0,j.jsxs)(u.Z,{className:f.title,children:[(0,j.jsxs)("div",{className:f.titleText,children:[v," ",n]}),(0,j.jsx)("div",{className:f.closeContainer,children:(0,j.jsx)(l.Z,{"aria-label":"close",className:f.closeButton,onClick:t,disableRipple:!0,size:"small",children:(0,j.jsx)(C.Z,{})})})]}),(0,j.jsx)(S,{}),(0,j.jsx)(c.Z,{open:M,className:f.snackBarModal,onClose:function(){B(!1),b("")},message:w,ContentProps:{className:"".concat(f.snackBar," ").concat(x&&"error"===x.type?f.errorSnackBar:"")},autoHideDuration:x&&"error"===x.type?1e4:5e3}),(0,j.jsx)(m.Z,{className:h?"":f.content,children:s})]}))})))},4247:function(e,t,o){o.d(t,{V:function(){return r}});var n=o(10594);function r(e){return(0,n.Z)("MuiDivider",e)}var a=(0,o(43349).Z)("MuiDivider",["root","absolute","fullWidth","inset","middle","flexItem","light","vertical","withChildren","withChildrenVertical","textAlignRight","textAlignLeft","wrapper","wrapperVertical"]);t.Z=a},31680:function(e,t,o){o.d(t,{Z:function(){return S}});var n=o(36222),r=o(1048),a=o(32793),i=o(50390),s=o(44977),l=o(50076),c=o(36128),d=o(8208),u=o(15573),m=o(57308),f=o(86875),p=o(40839),g=o(3299),x=o(4247),h=o(2198),b=o(23586),Z=o(10594);function v(e){return(0,Z.Z)("MuiMenuItem",e)}var C=(0,o(43349).Z)("MuiMenuItem",["root","focusVisible","dense","disabled","divider","gutters","selected"]),j=o(62559),y=["autoFocus","component","dense","divider","disableGutters","focusVisibleClassName","role","tabIndex"],k=(0,d.ZP)(f.Z,{shouldForwardProp:function(e){return(0,d.FO)(e)||"classes"===e},name:"MuiMenuItem",slot:"Root",overridesResolver:function(e,t){var o=e.ownerState;return[t.root,o.dense&&t.dense,o.divider&&t.divider,!o.disableGutters&&t.gutters]}})((function(e){var t,o=e.theme,r=e.ownerState;return(0,a.Z)({},o.typography.body1,{display:"flex",justifyContent:"flex-start",alignItems:"center",position:"relative",textDecoration:"none",minHeight:48,paddingTop:6,paddingBottom:6,boxSizing:"border-box",whiteSpace:"nowrap"},!r.disableGutters&&{paddingLeft:16,paddingRight:16},r.divider&&{borderBottom:"1px solid ".concat(o.palette.divider),backgroundClip:"padding-box"},(t={"&:hover":{textDecoration:"none",backgroundColor:o.palette.action.hover,"@media (hover: none)":{backgroundColor:"transparent"}}},(0,n.Z)(t,"&.".concat(C.selected),(0,n.Z)({backgroundColor:(0,c.Fq)(o.palette.primary.main,o.palette.action.selectedOpacity)},"&.".concat(C.focusVisible),{backgroundColor:(0,c.Fq)(o.palette.primary.main,o.palette.action.selectedOpacity+o.palette.action.focusOpacity)})),(0,n.Z)(t,"&.".concat(C.selected,":hover"),{backgroundColor:(0,c.Fq)(o.palette.primary.main,o.palette.action.selectedOpacity+o.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:(0,c.Fq)(o.palette.primary.main,o.palette.action.selectedOpacity)}}),(0,n.Z)(t,"&.".concat(C.focusVisible),{backgroundColor:o.palette.action.focus}),(0,n.Z)(t,"&.".concat(C.disabled),{opacity:o.palette.action.disabledOpacity}),(0,n.Z)(t,"& + .".concat(x.Z.root),{marginTop:o.spacing(1),marginBottom:o.spacing(1)}),(0,n.Z)(t,"& + .".concat(x.Z.inset),{marginLeft:52}),(0,n.Z)(t,"& .".concat(b.Z.root),{marginTop:0,marginBottom:0}),(0,n.Z)(t,"& .".concat(b.Z.inset),{paddingLeft:36}),(0,n.Z)(t,"& .".concat(h.Z.root),{minWidth:36}),t),!r.dense&&(0,n.Z)({},o.breakpoints.up("sm"),{minHeight:"auto"}),r.dense&&(0,a.Z)({minHeight:32,paddingTop:4,paddingBottom:4},o.typography.body2,(0,n.Z)({},"& .".concat(h.Z.root," svg"),{fontSize:"1.25rem"})))})),S=i.forwardRef((function(e,t){var o=(0,u.Z)({props:e,name:"MuiMenuItem"}),n=o.autoFocus,c=void 0!==n&&n,d=o.component,f=void 0===d?"li":d,x=o.dense,h=void 0!==x&&x,b=o.divider,Z=void 0!==b&&b,C=o.disableGutters,S=void 0!==C&&C,M=o.focusVisibleClassName,B=o.role,N=void 0===B?"menuitem":B,w=o.tabIndex,I=(0,r.Z)(o,y),P=i.useContext(m.Z),E={dense:h||P.dense||!1,disableGutters:S},L=i.useRef(null);(0,p.Z)((function(){c&&L.current&&L.current.focus()}),[c]);var O,F=(0,a.Z)({},o,{dense:E.dense,divider:Z,disableGutters:S}),D=function(e){var t=e.disabled,o=e.dense,n=e.divider,r=e.disableGutters,i=e.selected,s=e.classes,c={root:["root",o&&"dense",t&&"disabled",!r&&"gutters",n&&"divider",i&&"selected"]},d=(0,l.Z)(c,v,s);return(0,a.Z)({},s,d)}(o),T=(0,g.Z)(L,t);return o.disabled||(O=void 0!==w?w:-1),(0,j.jsx)(m.Z.Provider,{value:E,children:(0,j.jsx)(k,(0,a.Z)({ref:T,role:N,tabIndex:O,component:f,focusVisibleClassName:(0,s.Z)(D.focusVisible,M)},I,{ownerState:F,classes:D}))})}))},89472:function(e,t,o){o.d(t,{Z:function(){return r}});var n=o(72327);function r(e,t){var o="undefined"!==typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(!o){if(Array.isArray(e)||(o=(0,n.Z)(e))||t&&e&&"number"===typeof e.length){o&&(e=o);var r=0,a=function(){};return{s:a,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(e){throw e},f:a}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,s=!0,l=!1;return{s:function(){o=o.call(e)},n:function(){var e=o.next();return s=e.done,e},e:function(e){l=!0,i=e},f:function(){try{s||null==o.return||o.return()}finally{if(l)throw i}}}}}}]);
//# sourceMappingURL=6951.34c85fa1.chunk.js.map