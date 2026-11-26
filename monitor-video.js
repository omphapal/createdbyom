(function () {
  'use strict';

  var VIDEO_SRC = 'assets/monitor-video.mp4';
  var VIMEO_TEXTURE_OP = 'Ops.Team.TheDigitalPanda_BohMLn.VimeoTexture';

  function isVimeoTextureOpData(op) {
    if (!op) return false;
    if (op.objName === VIMEO_TEXTURE_OP) return true;
    if (op.opId && window.CABLES && CABLES.OPS && CABLES.OPS[op.opId]) {
      return CABLES.OPS[op.opId].objName === VIMEO_TEXTURE_OP;
    }
    return false;
  }

  function setOrAddPortIn(op, name, value, clearLinks) {
    op.portsIn = op.portsIn || [];
    for (var i = 0; i < op.portsIn.length; i++) {
      if (op.portsIn[i] && op.portsIn[i].name === name) {
        op.portsIn[i].value = value;
        if (clearLinks && op.portsIn[i].links) {
          delete op.portsIn[i].links;
        }
        return;
      }
    }
    op.portsIn.push({ name: name, value: value });
  }

  function removeLinksToPort(patchData, targetOpId, targetPortName) {
    if (!patchData || !Array.isArray(patchData.ops)) return;
    patchData.ops.forEach(function (op) {
      if (!op || !Array.isArray(op.portsOut)) return;
      op.portsOut.forEach(function (port) {
        if (!port || !Array.isArray(port.links)) return;
        port.links = port.links.filter(function (link) {
          return !(link && link.objIn === targetOpId && link.portIn === targetPortName);
        });
      });
    });
  }

  function patchHeroData(patchData) {
    if (!patchData || !Array.isArray(patchData.ops)) return;
    var targetIds = [];
    patchData.ops.forEach(function (op) {
      if (!isVimeoTextureOpData(op)) return;
      targetIds.push(op.id);
      setOrAddPortIn(op, 'Video URL', VIDEO_SRC, true);
      setOrAddPortIn(op, 'Autoplay', 1, false);
      setOrAddPortIn(op, 'Loop', 1, false);
      setOrAddPortIn(op, 'Mute', 1, false);
      setOrAddPortIn(op, 'Prefetch Manifest', 1, false);
      setOrAddPortIn(op, 'Show Interaction Needed Button', 0, false);
    });
    targetIds.forEach(function (id) {
      removeLinksToPort(patchData, id, 'Video URL');
    });
  }

  function installPatchHook() {
    var C = window.CABLES;
    if (!C || !C.Patch || !C.Patch.prototype || C.Patch.prototype.deSerialize.__opVideoPatched) {
      return false;
    }
    var origDeSerialize = C.Patch.prototype.deSerialize;
    var wrapped = function (patchData) {
      var args = Array.prototype.slice.call(arguments);
      if (this.config && this.config.glCanvasId === 'glcanvas' && patchData) {
        if (typeof patchData === 'string') {
          try {
            patchData = JSON.parse(patchData);
            args[0] = patchData;
          } catch (e) {}
        }
        patchHeroData(patchData);
      }
      return origDeSerialize.apply(this, args);
    };
    wrapped.__opVideoPatched = true;
    C.Patch.prototype.deSerialize = wrapped;
    return true;
  }

  if (!installPatchHook()) {
    document.addEventListener('CABLES.jsLoaded', installPatchHook, { capture: true });
  }
})();
