import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt

def forecast_trend():
    try:
        df = pd.read_csv('trend_timeseries.csv')
    except FileNotFoundError:
        print("Error: trend_timeseries.csv not found. Please create this file with 'ds' and 'y' columns.")
        return

    df['ds'] = pd.to_datetime(df['ds'])

    m = Prophet()
    m.fit(df)

    future = m.make_future_dataframe(periods=30)
    forecast = m.predict(future)

    fig = m.plot(forecast)
    plt.title("Trend Forecast")
    plt.xlabel("Date")
    plt.ylabel("Views")
    plt.savefig('trend_forecast_plot.png')
    print("Forecast plot saved to trend_forecast_plot.png")

if __name__ == "__main__":
    forecast_trend()