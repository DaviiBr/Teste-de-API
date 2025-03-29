<template>
  <div id="app">
    <h1>Busca de Operadoras</h1>

    <!-- Barra de pesquisa com 2 linhas de 3 campos -->
    <div class="search-container">
      <div class="search-row">
        <input v-model="cnpj" placeholder="CNPJ" @keyup.enter="handleSearch" />
        <input v-model="cidade" placeholder="Cidade" @keyup.enter="handleSearch" />
        <input v-model="uf" placeholder="UF (ex: SP)" @keyup.enter="handleSearch" maxlength="2" />
      </div>
      <div class="search-row">
        <input v-model="registroOperadora" placeholder="Registro Operadora" @keyup.enter="handleSearch" />
        <input v-model="nomeFantasia" placeholder="Nome Fantasia" @keyup.enter="handleSearch" />
        <input v-model="representante" placeholder="Representante" @keyup.enter="handleSearch" />
      </div>
      <div class="date-filters">
      <div class="date-filter-group">
        <label>Ordenar por data:</label>
        <select v-model="dateOrder" @change="handleSearch">
          <option value="">Padrão</option>
          <option value="asc">Mais antigas</option>
          <option value="desc">Mais recentes</option>
        </select>
      </div>

      <div class="date-filter-group">
        <label>Filtrar entre datas:</label>
        <input type="date" v-model="startDate" @change="handleDateRange">
        <span>até</span>
        <input type="date" v-model="endDate" @change="handleDateRange">
      </div>
    </div>
      <div class="button-row">
        <button @click="handleSearch">Buscar</button>
        <button v-if="hasSearched" @click="resetSearch">Limpar</button>
      </div>
    </div>

    <!-- Tabela de resultados -->
    <div class="table-container" v-if="operadoras.length > 0">
      <table class="styled-table">
        <thead>
          <tr>
            <th v-for="(value, key) in operadoras[0]" :key="key">
              {{ formatHeader(key) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(op, index) in operadoras" :key="index">
            <td v-for="(value, key) in op" :key="key">
              {{ isDateKey(key) ? formatDate(value) : value || '-' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mensagens de estado -->
    <div v-if="loading" class="status-message loading">Carregando...</div>
    <div v-if="error" class="status-message error">{{ error }}</div>
    <div v-if="operadoras.length === 0 && !loading" class="status-message">
      Nenhum resultado encontrado
    </div>

    <!-- Paginação -->
    <div v-if="totalPages > 1" class="pagination">
      <button 
        @click="changePage(currentPage - 1)" 
        :disabled="currentPage === 1"
      >
        Anterior
      </button>
      <span class="pagination-info">
        Página {{ currentPage }} de {{ totalPages }}
      </span>
      <button 
        @click="changePage(currentPage + 1)" 
        :disabled="currentPage === totalPages"
      >
        Próximo
      </button>
    </div>
  </div>
</template>

<script src="./script.js"></script>

<style src="./style.css"></style>