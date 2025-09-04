import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  Alert,
} from 'react-native';
import * as SQLite from 'expo-sqlite';

export default function App() {
  // Estado para armazenar a conexão com o banco de dados
  const [db, setDb] = useState(null);

  // Estado para armazenar os resultados da consulta
  const [results, setResults] = useState([]);

  // Estados para os campos de pesquisa
  const [searchText, setSearchText] = useState('');
  const [salarioMinimo, setSalarioMinimo] = useState('');

  // Estado para a mensagem de status (opcional, mas útil para feedback)
  const [status, setStatus] = useState('Inicializando...');

  // --- Efeito para inicializar o banco de dados uma única vez ---
  useEffect(() => {
    async function setupDatabase() {
      try {
        // Abrindo o banco de dados de forma segura
        const database = await SQLite.openDatabaseAsync('meu_banco.db');

        // Armazenando a referência do banco de dados no estado
        setDb(database);

        // Opcional: Criar a tabela se ela ainda não existir
        await database.execAsync(`
          CREATE TABLE IF NOT EXISTS funcionarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            salario REAL NOT NULL,
            cargo TEXT NOT NULL
          );
        `);
        setStatus('✅ Banco de dados e tabela prontos!');
      } catch (error) {
        console.error('Erro ao conectar ou criar tabela:', error);
        setStatus('❌ Erro ao inicializar o banco de dados. Veja o log.');
        Alert.alert('Erro', 'Não foi possível conectar ao banco de dados.');
      }
    }
    // Chamando a função de setup
    setupDatabase();
  }, []); // O array vazio garante que isso rode apenas na primeira renderização

  // --- Função genérica para executar consultas ---
  const executarConsulta = async (query, params = []) => {
    // Acessando a conexão do estado e verificando se ela exista
    if (!db) {
      Alert.alert('Erro', 'O banco de dados não está pronto.');
      return;
    }

    try {
      const rows = await db.getAllAsync(query, params);
      setResults(rows);
      if (rows.length === 0) {
        Alert.alert('Aviso', 'Nenhum resultado encontrado.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha na consulta. Verifique o console.');
      console.error('Erro na consulta:', error);
    }
  };

  // --- Funções de consulta específicas ---

  const exibirTodos = async () => {
    // Chamando a função genérica com a query para todos os funcionários
    await executarConsulta('SELECT * FROM funcionarios;');
  };

  const pesquisarNome = async () => {
    if (!searchText.trim()) {
      Alert.alert('Aviso', 'Digite um nome para pesquisar.');
      return;
    }
    // Usando LIKE e o parâmetro `?` para evitar SQL Injection
    await executarConsulta('SELECT * FROM funcionarios WHERE nome LIKE ?;', [
      `%${searchText}%`,
    ]);
  };

  const pesquisarSalario = async () => {
    const minSalario = parseFloat(salarioMinimo);
    if (isNaN(minSalario)) {
      Alert.alert('Aviso', 'Digite um número válido para o salário.');
      return;
    }
    // Pesquisando por salários maiores ou iguais ao valor informado
    await executarConsulta('SELECT * FROM funcionarios WHERE salario >= ?;', [
      minSalario,
    ]);
  };

  const pesquisarCargo = async () => {
    if (!searchText.trim()) {
      Alert.alert('Aviso', 'Digite um cargo para pesquisar.');
      return;
    }
    // Usando LIKE para pesquisar o cargo
    await executarConsulta('SELECT * FROM funcionarios WHERE cargo LIKE ?;', [
      `%${searchText}%`, // Sintaxe para conseguir usar o LIKE
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemTitle}>{item.nome}</Text>
      <Text style={styles.itemDetail}>
        ID: {item.id} • Cargo: {item.cargo}
      </Text>
      <Text style={styles.itemSalary}>
        Salário: R${Number(item.salario).toFixed(2)}
      </Text>
    </View>
  );

  // cor dinâmica para o status
  const statusColor = status.startsWith('✅')
    ? styles.colors.success
    : status.startsWith('❌')
    ? styles.colors.error
    : styles.colors.info;

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <Text style={styles.title}>Consultar Funcionários</Text>
        <Text style={[styles.statusText, { color: statusColor }]}>
          {status}
        </Text>
      </View>

      <View style={styles.searchCard}>
        <TextInput
          style={styles.input}
          placeholder="Nome ou Cargo"
          placeholderTextColor="#9AA4B2"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TextInput
          style={styles.input}
          placeholder="Salário Mínimo"
          placeholderTextColor="#9AA4B2"
          keyboardType="numeric"
          value={salarioMinimo}
          onChangeText={setSalarioMinimo}
        />

        <View style={styles.buttonContainer}>
          <View style={styles.btnWrapper}>
            <Button title="Exibir Todos" onPress={exibirTodos} disabled={!db} />
          </View>
          <View style={styles.btnWrapper}>
            <Button
              title="Pesquisar Nome"
              onPress={pesquisarNome}
              disabled={!db}
            />
          </View>
          <View style={styles.btnWrapper}>
            <Button
              title="Salários Acima de"
              onPress={pesquisarSalario}
              disabled={!db}
            />
          </View>
          <View style={styles.btnWrapper}>
            <Button
              title="Pesquisar Cargo"
              onPress={pesquisarCargo}
              disabled={!db}
            />
          </View>
        </View>
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={results}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum funcionário encontrado.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  colors: {
    background: '#F3F7FB',
    card: '#FFFFFF',
    primary: '#2563EB',
    info: '#0EA5E9',
    success: '#16A34A',
    error: '#DC2626',
    muted: '#6B7280',
    text: '#0F1724',
  },

  container: {
    flex: 1,
    backgroundColor: '#F3F7FB',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 20,
  },

  headerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#0b1724',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
    alignItems: 'center',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F1724',
    marginBottom: 6,
    textAlign: 'center',
  },

  statusText: {
    fontSize: 13,
    color: '#64748B',
  },

  searchCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#0b1724',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },

  input: {
    height: 46,
    backgroundColor: '#FBFDFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E6EEF8',
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#0F1724',
    marginBottom: 10,
  },

  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 4,
  },

  btnWrapper: {
    width: '48%',
    marginBottom: 8,
  },

  list: {
    flex: 1,
    marginTop: 6,
  },

  listContent: {
    paddingBottom: 24,
  },

  item: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#0b1724',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },

  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F1724',
    marginBottom: 6,
  },

  itemDetail: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 6,
  },

  itemSalary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
  },

  emptyText: {
    textAlign: 'center',
    color: '#64748B',
    marginTop: 20,
  },
});
