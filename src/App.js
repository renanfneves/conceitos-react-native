import React, { useState, useEffect } from "react";
import api from './services/api';

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function App() {
  const [repositories, handleRepositories] = useState([]);

  async function getRepositories() {
    const repos = await api.get("repositories");
     
    handleRepositories([ ...repos.data ]);
  }

  async function handleLikeRepository(id) {
    const { data } = await api.post(`/repositories/${id}/like`);
    
    const reposOverwrite = repositories;
    const repo = reposOverwrite.find(repo => repo.id === id);

    repo.likes = data.likes;
    
    handleRepositories([ ...reposOverwrite ]) 
  }

  useEffect(() => {
    getRepositories();
  }, [])

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList 
          data={repositories}
          keyExtractor={repo => repo.id}
          renderItem={
            ({ item }) => (
              <View style={styles.repositoryContainer}>
                <Text style={styles.repository}>{item.title}</Text>
                <View style={styles.techsContainer}>
                  {item.techs.map((tech, index) => ( 
                    <Text style={styles.tech} key={`${item.id}_tech_${index}`}>
                      {tech}
                    </Text>
                  ))}
                </View>

                <View style={styles.likesContainer}>
                  <Text
                    style={styles.likeText}
                    testID={`repository-likes-${item.id}`}
                  >
                    {`${item.likes} curtidas`}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleLikeRepository(item.id)}
                  testID={`like-button-${item.id}`}
                >
                  <Text style={styles.buttonText}>Curtir</Text>
                </TouchableOpacity>
              </View>
            )
        }>
        </FlatList>
        
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
