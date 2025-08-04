$(document).ready(function() {
    // Presets de animação
    const presets = [
      {
        name: "Fade In",
        config: {
          opacity: [0, 1],
          duration: 800,
          easing: 'easeInOutQuad'
        }
      },
      {
        name: "Slide Right",
        config: {
          translateX: ['0px', '150px', '0px'],
          duration: 1000,
          easing: 'easeOutBack'
        }
      },
      {
        name: "Bounce",
        config: {
          translateY: ['0px', '-50px', '0px'],
          duration: 900,
          easing: 'easeOutBounce'
        }
      },
      {
        name: "Pulse",
        config: {
          scale: [1, 1.2, 1],
          duration: 800,
          easing: 'easeInOutSine',
          loop: true
        }
      },
      {
        name: "Rotate",
        config: {
          rotate: ['0deg', '360deg', '0deg'],
          duration: 1200,
          easing: 'linear'
        }
      },
      {
        name: "Color Change",
        config: {
          backgroundColor: ['#4a6bff', '#ff6b6b', '#4a6bff'],
          duration: 1000,
          easing: 'easeInOutQuad'
        }
      }
    ];
  
    // Elemento de preview
    const $previewElement = $('#previewElement');
    let currentAnimation = null;
  
    // Inicialização
    function init() {
      renderPresets();
      setupEventListeners();
      resetElement();
      setDefaultValues($('#animType').val());
    }
  
    // Configura listeners
    function setupEventListeners() {
      // Botão Animar
      $('#btnAnimate').on('click', function() {
        const config = getAnimationConfig();
        playAnimation(config);
        renderCode(config);
      });
  
      // Botão Reset
      $('#btnReset').on('click', resetElement);
  
      // Botão Copiar Código
      $('#btnCopyCode').on('click', copyCodeToClipboard);
  
      // Atualiza valores padrão quando muda o tipo
      $('#animType').on('change', function() {
        setDefaultValues($(this).val());
      });
    }
  
    // Define valores padrão para cada tipo
    function setDefaultValues(type) {
      switch(type) {
        case 'translateX':
          $('#startValue').val('0px');
          $('#endValue').val('100px');
          break;
        case 'translateY':
          $('#startValue').val('0px');
          $('#endValue').val('100px');
          break;
        case 'scale':
          $('#startValue').val('1');
          $('#endValue').val('1.5');
          break;
        case 'rotate':
          $('#startValue').val('0deg');
          $('#endValue').val('360deg');
          break;
        case 'opacity':
          $('#startValue').val('0');
          $('#endValue').val('1');
          break;
        case 'backgroundColor':
          $('#startValue').val('#4a6bff');
          $('#endValue').val('#ff6b6b');
          break;
      }
    }
  
    // Obtém configuração do formulário
    function getAnimationConfig() {
      const type = $('#animType').val();
      let start = $('#startValue').val();
      let end = $('#endValue').val();
      const duration = parseInt($('#duration').val()) || 1000;
      const delay = parseInt($('#delay').val()) || 0;
      const easing = $('#easing').val();
      const loop = $('#loop').is(':checked');
      const alternate = $('#alternate').is(':checked');
  
      // Formata valores com unidades quando necessário
      if (type === 'translateX' || type === 'translateY') {
        start = formatValueWithUnit(start, 'px');
        end = formatValueWithUnit(end, 'px');
      } else if (type === 'rotate') {
        start = formatValueWithUnit(start, 'deg');
        end = formatValueWithUnit(end, 'deg');
      }
  
      // Configuração da animação com retorno ao início
      const config = {
        targets: '#previewElement',
        [type]: [start, end, start], // Sempre volta ao início
        duration: duration,
        delay: delay,
        easing: easing,
        loop: loop,
        begin: function() {
          $previewElement.css('transition', 'none');
        }
      };
  
      return config;
    }
  
    // Formata valores com unidades
    function formatValueWithUnit(value, unit) {
      if (typeof value === 'string' && value.match(/[a-zA-Z%]/)) {
        return value;
      }
      const num = parseFloat(value) || 0;
      return num + unit;
    }
  
    // Executa a animação
    function playAnimation(config) {
      // Para qualquer animação atual
      if (currentAnimation) {
        currentAnimation.pause();
      }
      
      // Reseta o elemento antes de animar
      resetElement();
      
      // Executa a nova animação
      currentAnimation = anime(config);
    }
  
    // Reseta o elemento
    function resetElement() {
      if (currentAnimation) {
        currentAnimation.pause();
      }
      
      $previewElement.css({
        transform: 'none',
        opacity: '1',
        backgroundColor: '#4a6bff'
      });
    }
  
    // Renderiza o código
    function renderCode(config) {
      let code = 'anime({\n';
      code += `  targets: '#previewElement',\n`;
      code += `  ${Object.keys(config)[1]}: [${config[Object.keys(config)[1]].map(v => `'${v}'`).join(', ')}],\n`;
      code += `  duration: ${config.duration},\n`;
      code += `  easing: '${config.easing}',\n`;
      code += `  loop: ${config.loop}\n`;
      code += '});';
      
      $('#codeOutput').text(code);
    }
  
    // Copia o código
    function copyCodeToClipboard() {
      const code = $('#codeOutput').text();
      navigator.clipboard.writeText(code).then(() => {
        alert('Código copiado!');
      });
    }
  
    // Renderiza presets
    function renderPresets() {
      const $presetList = $('#presetList');
      $presetList.empty();
      
      presets.forEach(preset => {
        const $preset = $(`<div class="preset-item">${preset.name}</div>`);
        $preset.on('click', () => {
          applyPreset(preset.config);
        });
        $presetList.append($preset);
      });
    }
  
    // Aplica um preset
    function applyPreset(config) {
      // Para animação atual
      if (currentAnimation) {
        currentAnimation.pause();
      }
      
      // Reseta elemento
      resetElement();
      
      // Executa animação do preset
      currentAnimation = anime({
        ...config,
        targets: '#previewElement',
        begin: function() {
          $previewElement.css('transition', 'none');
        }
      });
      
      // Atualiza formulário
      updateFormWithConfig(config);
      
      // Renderiza código
      renderCode(config);
    }
  
    // Atualiza formulário com configuração
    function updateFormWithConfig(config) {
      const prop = Object.keys(config)[1];
      const values = config[prop];
      
      // Mapeia propriedade para tipo
      const typeMap = {
        translateX: 'translateX',
        translateY: 'translateY',
        scale: 'scale',
        rotate: 'rotate',
        opacity: 'opacity',
        backgroundColor: 'backgroundColor'
      };
      
      const animType = typeMap[prop];
      if (animType) {
        $('#animType').val(animType);
        $('#startValue').val(values[0]);
        $('#endValue').val(values[1]);
        $('#duration').val(config.duration);
        $('#easing').val(config.easing);
        $('#loop').prop('checked', config.loop || false);
      }
    }
  
    // Inicializa
    init();
  });