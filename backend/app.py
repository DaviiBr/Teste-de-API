from flask import Flask, request, jsonify
from flask_cors import CORS
from config import get_db_connection  # Importa a função de conexão do config.py

app = Flask(__name__)
CORS(app)  # Habilita CORS para todas as rotas

@app.route('/operadoras', methods=['GET'])
def get_operadoras():
    cnpj = request.args.get('cnpj')
    cidade = request.args.get('cidade')  # Novo filtro
    uf = request.args.get('uf')                     # Novo filtro
    registro_operadora = request.args.get('registro_operadora')
    nome_fantasia = request.args.get('nome_fantasia')
    representante = request.args.get('representante')
    date_order = request.args.get('date_order')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 50))

    offset = (page - 1) * limit

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        query = "SELECT * FROM operadoras WHERE 1=1"
        params = []

        # Adicione filtros condicionais
        if cnpj:
            query += " AND CNPJ = %s"
            params.append(cnpj)
        if cidade:
            query += " AND Cidade LIKE %s"
            params.append(f"%{cidade}%")
        if uf:
            query += " AND UF = %s"
            params.append(uf.upper())
        if registro_operadora:
            query += " AND REGISTRO_OPERADORA LIKE %s"
            params.append(f"%{registro_operadora}%")
        if nome_fantasia:
            query += " AND Nome_Fantasia LIKE %s"
            params.append(f"%{nome_fantasia}%")
        if representante:
            query += " AND Representante LIKE %s"
            params.append(f"%{representante}%")
        if start_date and end_date:
            query += " AND Data_Registro_ANS BETWEEN %s AND %s"
            params.extend([start_date, end_date])
        elif start_date:
            query += " AND Data_Registro_ANS >= %s"
            params.append(start_date)
        elif end_date:
            query += " AND Data_Registro_ANS <= %s"
            params.append(end_date)

        # Ordenação por data
        if date_order:
            query += " ORDER BY Data_Registro_ANS"
            query += " DESC" if date_order == 'desc' else " ASC"

        query += " LIMIT %s OFFSET %s"
        params.extend([limit, offset])

        cursor.execute(query, params)
        operadoras = cursor.fetchall()

        # ... (mantenha o restante da lógica existente)

        # Conta o total de operadoras para determinar o número de páginas
        cursor.execute("SELECT COUNT(*) FROM operadoras;")
        total_count = cursor.fetchone()['COUNT(*)']
        total_pages = (total_count // limit) + (1 if total_count % limit else 0)

        # Fecha a conexão com o banco de dados
        conn.close()

        if not operadoras:
            return jsonify({"error": "Operadora não encontrada"}), 404

        # Formata o resultado
        resultado = [{
            "REGISTRO_OPERADORA": op['REGISTRO_OPERADORA'],
            "CNPJ": op['CNPJ'],
            "Razao_Social": op['Razao_Social'],
            "Nome_Fantasia": op['Nome_Fantasia'],
            "Modalidade": op['Modalidade'],
            "Logradouro": op['Logradouro'],
            "Numero": op['Numero'],
            "Complemento": op['Complemento'],
            "Bairro": op['Bairro'],
            "Cidade": op['Cidade'],
            "UF": op['UF'],
            "CEP": op['CEP'],
            "DDD": op['DDD'],
            "Telefone": op['Telefone'],
            "Fax": op['Fax'],
            "Endereco_eletronico": op['Endereco_eletronico'],
            "Representante": op['Representante'],
            "Cargo_Representante": op['Cargo_Representante'],
            "Regiao_de_Comercializacao": op['Regiao_de_Comercializacao'],
            "Data_Registro_ANS": op['Data_Registro_ANS']
        } for op in operadoras]

        # Retorna os dados e informações de paginação
        return jsonify({
            "operadoras": resultado,
            "total_pages": total_pages,
            "current_page": page
        })

    except Exception as e:
        print(f"Erro na consulta: {e}")  # Log de erro
        return jsonify({"error": "Erro ao acessar o banco de dados"}), 500

    
if __name__ == '__main__':
    app.run(debug=True)
