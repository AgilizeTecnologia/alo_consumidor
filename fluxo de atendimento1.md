# SRS --- Software Requirements Specification

## Rotina de Atendimento com IA + Mediação Humana

## 1. Introdução

### 1.1 Propósito

Este documento descreve de forma detalhada os requisitos funcionais, não
funcionais, regras de negócio e fluxos operacionais do módulo Rotina de
Atendimento (Denúncia + IA + Mediação Humana) do sistema.

### 1.2 Escopo

O sistema permite que usuários acessem o módulo de denúncias mediante
login, registrem nova denúncia, enviem evidências, recebam análise
automática da IA, optem por conversar com mediador humano e recebam
protocolo final por e-mail.

### 1.3 Definições

-   IA --- Inteligência Artificial
-   CDC --- Código de Defesa do Consumidor
-   Handover --- Transferência do atendimento da IA para humano
-   Protocolo --- Código exclusivo de atendimento

## 2. Descrição Geral

### 2.1 Perspectiva do Produto

Fluxo integrado entre frontend, backend, IA, chat humano e serviço de
e-mail.

### 2.2 Usuários

-   Consumidor
-   IA Automatizada
-   Mediador humano

### 2.3 Restrições

Conformidade com LGPD, limites de upload, segurança no processo.

### 2.4 Dependências

-   Geolocalização
-   Armazenamento de arquivos
-   Motor da IA
-   Chat com handover

## 3. Requisitos Funcionais

### 3.1 Acesso

-   RF-001: Iniciar fluxo via "Fazer Denúncia"
-   RF-002: Tela de login com CPF e senha
-   RF-003: Criar conta
-   RF-004: Acesso pós-login

### 3.2 Denúncia

-   RF-005: Registrar Nova Denúncia
-   RF-006: Formulário completo
-   RF-007 a RF-009: Upload fotos, vídeos e localização
-   RF-010: Enviar Denúncia

### 3.3 Análise IA

-   RF-011: Início automático
-   RF-012: Tela de processamento
-   RF-013: Tempo mínimo configurável
-   RF-014: Exibir análise completa da IA

### 3.4 Continuidade

-   RF-015: Perguntar se deseja falar com mediador
-   RF-016: Botões A (mediador) e B (concluir)

### 3.5 Fluxo A

-   RF-017: Abrir chat
-   RF-018: Mensagens iniciais IA
-   RF-019: Handover humano
-   RF-020: Botão Finalizar
-   RF-021: Gerar protocolo + e-mail + logout

### 3.6 Fluxo B

-   RF-022: Gerar protocolo + e-mail + logout

### 3.7 Finalização

-   RF-023 a RF-025: Encerrar sessão e retornar ao início

## 4. Requisitos Não Funcionais

### Desempenho

-   RNF-001: Upload até 10s
-   RNF-002: IA processa em até 3s backend

### Usabilidade

-   RNF-003: Botões mínimos
-   RNF-004: Acessibilidade

### Segurança

-   RNF-005: HTTPS
-   RNF-006: LGPD
-   RNF-007: Armazenamento seguro

### Disponibilidade

-   RNF-008: 24/7
-   RNF-009: Handover seguro

## 5. Regras de Negócio

-   RN-001: Denúncia apenas após login
-   RN-002: Descrição obrigatória
-   RN-003: Formato do protocolo
-   RN-004: Compressão automática
-   RN-005: E-mail com resumo completo

## 6. Fluxo Geral

1.  Login
2.  Registrar denúncia
3.  Análise IA
4.  Escolher fluxo A ou B
5.  Protocolo + e-mail
6.  Logout
