from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

def build_duracion_model():
    numeric_features = ["persona_id", "sala_id", "articulo_id"]
    model = Pipeline([
        ("regressor", RandomForestRegressor(n_estimators=100, random_state=42))
    ])
    return model

def build_demanda_model():
    categorical_features = ["sala_id"]
    preprocessor = ColumnTransformer([
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features)
    ], remainder="passthrough")

    model = Pipeline([
        ("preprocessor", preprocessor),
        ("regressor", LinearRegression())
    ])
    return model
