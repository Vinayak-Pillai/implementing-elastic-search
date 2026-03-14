# Implementing Elasticsearch with Node.js

An implementation for learning how to integrate Elasticsearch into a Node.js application. This project uses the official `@elastic/elasticsearch` client to demonstrate core search concepts, from basic CRUD operations to complex boolean and fuzzy queries.

## 🚀 Features & Concepts Covered

This repository contains practical examples of:
* **Connecting to Elasticsearch:** Setting up a local development client.
* **Basic Indexing & Searching:** Adding individual JSON documents and retrieving them.
* **Bulk Indexing:** Simulating importing hundreds of records from a primary database efficiently.
* **Fuzzy Searching (Typo-Tolerance):** Handling user spelling mistakes using Levenshtein distance (`fuzziness: 'AUTO'`).
* **Prefix Searching:** Creating search-as-you-type/autocomplete functionality (`match_phrase_prefix`).
* **Boolean Queries:** Combining multiple search rules and filters (`must`, `filter`, `must_not`).
* **Nested Object Queries:** Searching deep JSON structures using dot notation (e.g., `"pin.location.lat"`).

## 🛠 Prerequisites

To run this project locally, you will need:
* [Node.js](https://nodejs.org/) installed.
* [Docker](https://www.docker.com/) installed (to run the local Elasticsearch instance).

## ⚙️ Setup & Installation

### 1. Start the Local Elasticsearch Database
Instead of dealing with complex security certificates for local development, we run a single-node Elasticsearch container via Docker with security disabled. 

Open your terminal and run:

```bash
docker run -p 9200:9200 -e "discovery.type=single-node" -e "xpack.security.enabled=false" -m 1GB docker.elastic.co/elasticsearch/elasticsearch:8.13.0
