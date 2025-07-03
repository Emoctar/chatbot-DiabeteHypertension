// <!-- JS pour onglets -->

  function showTab(tabName) {
      document.querySelectorAll('.tab-content').forEach(el => {
          el.classList.remove('active');
      });
      document.querySelectorAll('.tab-button').forEach(btn => {
          btn.classList.remove('active');
      });

      document.getElementById('tab-' + tabName).classList.add('active');
      event.target.classList.add('active');
  }
