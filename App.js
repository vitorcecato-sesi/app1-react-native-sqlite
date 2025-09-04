// Importa o handler de gestos para garantir funcionamento do Drawer
import 'react-native-gesture-handler';
// Importa componentes básicos do React Native
import { View, Text, StyleSheet, Platform } from 'react-native';
// Importa o root view do Gesture Handler para gestos complexos
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// Importa o container de navegação
import { NavigationContainer } from '@react-navigation/native';
// Importa o Drawer Navigator e componentes para customização do Drawer
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

// Importa telas do app
import CriarBanco from './screens/criarBancoDeDados';
import CriarTabela from './screens/criarTabela';
import InserirFuncionario from './screens/inserirFuncionarios';
import PesquisarFuncionarios from './screens/pesquisarFuncionarios';

// Cria o Drawer Navigator
const Drawer = createDrawerNavigator();

// Componente para customizar o conteúdo do Drawer, incluindo avatar, título, subtítulo e rodapé
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerScroll}>
      {/* Cabeçalho do Drawer com avatar, nome do app e subtítulo */}
      <View style={[styles.header, Platform.OS === 'ios' && styles.headerIosPadding]}>
        <View style={styles.avatar}>
          {/* Avatar com iniciais do app */}
          <Text style={styles.avatarText}>DB</Text>
        </View>
        <Text style={styles.appName}>TesteSQLite</Text>
        <Text style={styles.appSubtitle}>Banco local • SQLite</Text>
      </View>

      {/* Lista de itens do Drawer (navegação entre telas) */}
      <View style={styles.items}>
        <DrawerItemList {...props} />
      </View>

      {/* Rodapé do Drawer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Versão 1.0 • Dados locais</Text>
      </View>
    </DrawerContentScrollView>
  );
}

// Componente principal do App
export default function App() {
  return (
    // Root View necessário para gestos do Drawer
    // 🚩 GestureHadlerRootView usamos para obter as animações mais avançadas do Drawer
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Container de navegação */}
      <NavigationContainer>
        <Drawer.Navigator
        // 🚩 Define a tela inicial do Drawer
          initialRouteName="Criar Banco"
          // 🚩 O ...props recebe a estilização do Drawer total
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            // Estilização do cabeçalho das telas
            headerStyle: { backgroundColor: '#0f1724' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '700' },

            // Estilização do Drawer
            drawerStyle: {
              backgroundColor: '#f8fafc',
              width: 300,
            },
            drawerActiveBackgroundColor: '#2563eb',
            drawerActiveTintColor: '#ffffff',
            drawerInactiveTintColor: '#0f1724',
            drawerLabelStyle: {
              marginLeft: -8,
              fontSize: 15,
              fontWeight: '600',
            },

            // Configurações do Drawer
            drawerType: 'slide',
            overlayColor: 'rgba(0,0,0,0.2)',
            sceneContainerStyle: { backgroundColor: '#f1f5f9' }
          }}
        >
          {/* Telas do Drawer */}
          <Drawer.Screen name="Criar Banco" component={CriarBanco} />
          <Drawer.Screen name="Criar Tabela" component={CriarTabela} />
          <Drawer.Screen name="Inserir Funcionário" component={InserirFuncionario} />
          <Drawer.Screen name="Pesquisar Funcionários" component={PesquisarFuncionarios} />
        </Drawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

// Estilos do Drawer, cabeçalho, avatar e rodapé
const styles = StyleSheet.create({
  drawerScroll: {
    flex: 1,
    paddingTop: 0,
  },

  // Estilização do cabeçalho principal do Drawer
  header: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
  },

  // Padding extra para iOS (evita notch)
  headerIosPadding: {
    paddingTop: 34, // Espaço extra no topo para iPhones com notch
    paddingBottom: 16,
  },

  // Avatar (círculo branco com iniciais)
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    // Sombra sutil para destaque
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  // Texto dentro do avatar
  avatarText: {
    color: '#2563eb',
    fontWeight: '800',
    fontSize: 22,
  },

  // Nome do aplicativo
  appName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },

  // Subtítulo do aplicativo
  appSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    marginTop: 4,
  },

  // Container para os itens do Drawer
  items: {
    paddingHorizontal: 6,
    paddingTop: 8,
  },

  // Rodapé do Drawer
  footer: {
    marginTop: 'auto',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderTopWidth: 1,
    borderTopColor: '#eef2ff',
  },

  // Texto do rodapé
  footerText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
