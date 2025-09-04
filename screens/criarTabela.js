// Importa React e hooks necessários
import React, { useEffect, useState } from 'react';
// Importa componentes do React Native para UI
import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
// Importa SQLite do Expo para trabalhar com banco de dados local
import * as SQLite from 'expo-sqlite';

export default function App() {
  // Estado para mensagem de status (ex: sucesso, erro, etc)
  const [mensagem, setMensagem] = useState('Inicializando o banco de dados...');
  // Estado para armazenar a referência do banco de dados
  const [db, setDb] = useState(null);

  // useEffect roda uma vez ao montar o componente, inicializando o banco
  useEffect(() => {
    async function setupDatabase() {
      try {
        // Abre (ou cria) o banco de dados chamado 'meu_banco.db'
        const database = await SQLite.openDatabaseAsync('meu_banco.db');
        setDb(database); // Salva referência do banco no estado
        setMensagem('✅ Conexão com o banco de dados estabelecida.');
      } catch (error) {
        console.error('Erro ao conectar com o banco de dados:', error);
        setMensagem('❌ Erro ao conectar com o banco de dados.');
      }
    }
    setupDatabase();
  }, []);

  // Função que cria a tabela 'funcionarios' no banco
  const criarTabela = async () => {
    // Verifica se o banco foi inicializado
    if (!db) {
      setMensagem('❌ O banco de dados não está pronto.');
      Alert.alert('Erro', 'Banco de dados não foi inicializado.');
      return;
    }

    try {
      // Executa comando SQL para criar a tabela caso não exista
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS funcionarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          salario REAL NOT NULL,
          cargo TEXT NOT NULL
        );
      `);
      setMensagem('✅ Tabela "funcionarios" criada com sucesso!');
      Alert.alert('Sucesso', 'Tabela "funcionarios" criada!');
    } catch (error) {
      console.error('Erro ao criar tabela:', error);
      setMensagem('❌ Erro ao criar a tabela. Veja o log.');
      Alert.alert('Erro', 'Falha ao criar a tabela.');
    }
  };

  // Determina cor do status dinamicamente conforme a mensagem
  const statusColor =
    mensagem.startsWith('✅') ? styles.colors.success :
    mensagem.startsWith('❌') ? styles.colors.error :
    styles.colors.info;

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        {/* Título do card */}
        <Text style={styles.title}>Criar Tabela no Banco de Dados</Text>

        {/* Botão para criar tabela, desabilitado se o banco não estiver pronto */}
        <TouchableOpacity
          style={[styles.button, !db && styles.buttonDisabled]}
          onPress={criarTabela}
          activeOpacity={0.8}
          disabled={!db}
        >
          <Text style={[styles.buttonText, !db && styles.buttonTextDisabled]}>
            Criar Tabela Funcionários
          </Text>
        </TouchableOpacity>

        {/* Mensagem de status do banco/tabela */}
        <Text style={[styles.statusText, { color: statusColor }]}>{mensagem}</Text>

        {/* Dica para o usuário */}
        <Text style={styles.hint}>
          Pressione o botão para criar a tabela. A tabela só será criada se a conexão com o banco estiver ativa.
        </Text>
      </View>
    </View>
  );
}

// Estilos usados no componente
const styles = StyleSheet.create({
  colors: {
    success: '#16a34a', // verde para sucesso
    error: '#dc2626',   // vermelho para erro
    info: '#0ea5e9',    // azul claro para neutro
    background: '#f3f6fb',
    cardBg: '#ffffff',
    textPrimary: '#0b1220',
    muted: '#6b7280',
    buttonBg: '#2563eb', // azul do botão
    buttonText: '#ffffff',
    disabledBg: '#cbd5e1',
  },
  screen: {
    flex: 1,
    backgroundColor: '#eef4fb',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 760,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 28,
    paddingHorizontal: 22,
    alignItems: 'center',
    shadowColor: '#0b1724',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0b1220',
    marginBottom: 18,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#d1d5db',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonTextDisabled: {
    color: '#7b8794',
  },
  statusText: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  hint: {
    marginTop: 12,
    color: '#6b7280',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 620,
  },
});
