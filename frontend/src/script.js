import { ref, onMounted } from 'vue';

export default {
  name: 'App',
  setup() {
    // Estados de busca
    const cnpj = ref('');
    const cidade = ref('');
    const uf = ref('');
    const registroOperadora = ref('');
    const nomeFantasia = ref('');
    const representante = ref('');
    const dateOrder = ref(''); // 'asc' ou 'desc'
    const startDate = ref('');
    const endDate = ref('');

    // Estados da aplicação
    const operadoras = ref([]);
    const currentPage = ref(1);
    const totalPages = ref(0);
    const pageSize = 50;
    const hasSearched = ref(false);
    const loading = ref(false);
    const error = ref('');

    // Busca inicial ao carregar a página
    onMounted(() => {
      fetchOperadoras();
    });

    // Função principal de busca
    const handleSearch = async () => {
      loading.value = true;
      error.value = '';
      
      try {
        const params = {
          page: currentPage.value,
          limit: pageSize,
          // Filtros existentes
          ...(cnpj.value && { cnpj: cnpj.value }),
          ...(cidade.value && { cidade: cidade.value }),
          ...(uf.value && { uf: uf.value.toUpperCase() }),
          ...(registroOperadora.value && { registro_operadora: registroOperadora.value }),
          ...(nomeFantasia.value && { nome_fantasia: nomeFantasia.value }),
          ...(representante.value && { representante: representante.value }),
          // Novos filtros de data
          ...(dateOrder.value && { date_order: dateOrder.value }),
          ...(startDate.value && { start_date: startDate.value }),
          ...(endDate.value && { end_date: endDate.value })
        };

        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`http://127.0.0.1:5000/operadoras?${queryString}`);
        const data = await response.json();

        if (data.error) {
          error.value = data.error;
          operadoras.value = [];
        } else {
          operadoras.value = data.operadoras || [];
          totalPages.value = data.total_pages || 0;
          hasSearched.value = Object.values(params).some(
            (val, index) => index > 1 && val !== undefined
          );
        }
      } catch (err) {
        error.value = "Erro ao buscar dados. Tente novamente.";
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    // Validação do intervalo de datas
    const handleDateRange = () => {
      if (startDate.value && endDate.value) {
        if (new Date(startDate.value) > new Date(endDate.value)) {
          error.value = "A data final deve ser posterior à data inicial";
          endDate.value = '';
          return;
        }
        handleSearch();
      }
    };

    // Reset da busca
    const resetSearch = () => {
      cnpj.value = '';
      cidade.value = '';
      uf.value = '';
      registroOperadora.value = '';
      nomeFantasia.value = '';
      representante.value = '';
      dateOrder.value = '';
      startDate.value = '';
      endDate.value = '';
      hasSearched.value = false;
      fetchOperadoras();
    };

    // Busca sem filtros
    const fetchOperadoras = async (page = 1) => {
      loading.value = true;
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/operadoras?page=${page}&limit=${pageSize}`
        );
        const data = await response.json();
        operadoras.value = data.operadoras;
        totalPages.value = data.total_pages;
        currentPage.value = data.current_page;
      } catch (err) {
        error.value = "Erro ao carregar operadoras.";
      } finally {
        loading.value = false;
      }
    };

    // Navegação entre páginas
    const changePage = (page) => {
      if (page < 1 || page > totalPages.value) return;
      currentPage.value = page;
      if (hasSearched.value) {
        handleSearch();
      } else {
        fetchOperadoras(page);
      }
    };

    // Formata cabeçalhos da tabela
    const formatHeader = (key) => {
      return key
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .trim();
    };

    
    const formatDate = (dateString) => {
      if (!dateString) return '-';
      try {
        // Formata para DD/MM/AAAA
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString; // Retorna o original se não for data válida
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      } catch {
        return dateString; // Se der erro, retorna o valor original
      }
    };
    const isDateKey = (key) => {
      const dateKeys = ['data', 'date', 'created', 'updated']; // Adicione aqui os nomes de campos que contêm datas
      return dateKeys.some(dateKey => key.toLowerCase().includes(dateKey));
    };

    return {
      // Estados
      cnpj,
      cidade,
      uf,
      registroOperadora,
      nomeFantasia,
      representante,
      dateOrder,
      startDate,
      endDate,
      operadoras,
      currentPage,
      totalPages,
      loading,
      error,
      hasSearched,
      formatDate,
      isDateKey,
      
      // Métodos
      handleSearch,
      handleDateRange,
      resetSearch,
      changePage,
      formatHeader
    };
  }
};