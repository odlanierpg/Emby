define(["focusManager","dom","scrollStyles"],function(focusManager,dom){"use strict";function getBoundingClientRect(elem){return elem.getBoundingClientRect?elem.getBoundingClientRect():{top:0,left:0}}function getPosition(scrollContainer,item,horizontal){var slideeOffset=getBoundingClientRect(scrollContainer),itemOffset=getBoundingClientRect(item),offset=horizontal?itemOffset.left-slideeOffset.left:itemOffset.top-slideeOffset.top,size=horizontal?itemOffset.width:itemOffset.height;size||0===size||(size=item[horizontal?"offsetWidth":"offsetHeight"]);var currentStart=horizontal?scrollContainer.scrollLeft:scrollContainer.scrollTop;offset+=currentStart;var frameSize=horizontal?scrollContainer.offsetWidth:scrollContainer.offsetHeight,currentEnd=currentStart+frameSize,isVisible=offset>=currentStart&&offset+size<=currentEnd;return{start:offset,center:offset-frameSize/2+size/2,end:offset-frameSize+size,size:size,isVisible:isVisible}}function toCenter(container,elem,horizontal,skipWhenVisible){var pos=getPosition(container,elem,horizontal);skipWhenVisible&&pos.isVisible||(container.scrollTo?horizontal?container.scrollTo(pos.center,0):container.scrollTo(0,pos.center):horizontal?container.scrollLeft=Math.round(pos.center):container.scrollTop=Math.round(pos.center))}function toStart(container,elem,horizontal,skipWhenVisible){var pos=getPosition(container,elem,horizontal);skipWhenVisible&&pos.isVisible||(container.scrollTo?horizontal?container.scrollTo(pos.start,0):container.scrollTo(0,pos.start):horizontal?container.scrollLeft=Math.round(pos.start):container.scrollTop=Math.round(pos.start))}function centerOnFocus(e,scrollSlider,horizontal){var focused=focusManager.focusableParent(e.target);focused&&toCenter(scrollSlider,focused,horizontal)}function centerOnFocusHorizontal(e){centerOnFocus(e,this,!0)}function centerOnFocusVertical(e){centerOnFocus(e,this,!1)}return{getPosition:getPosition,centerFocus:{on:function(element,horizontal){horizontal?dom.addEventListener(element,"focus",centerOnFocusHorizontal,{capture:!0,passive:!0}):dom.addEventListener(element,"focus",centerOnFocusVertical,{capture:!0,passive:!0})},off:function(element,horizontal){horizontal?dom.removeEventListener(element,"focus",centerOnFocusHorizontal,{capture:!0,passive:!0}):dom.removeEventListener(element,"focus",centerOnFocusVertical,{capture:!0,passive:!0})}},toCenter:toCenter,toStart:toStart}});