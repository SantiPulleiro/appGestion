// Ultima_version - App completa con diseño mejorado
import React, { useState, useEffect } from "react";
import { Wallet, PiggyBank, List, MoreHorizontal, ArrowLeft } from "lucide-react";

export default function App() {
  const [pantalla, setPantalla] = useState("index");
  const [sueldo, setSueldo] = useState(0);
  const [diaCobro, setDiaCobro] = useState("");
  const [ultimaFechaCobro, setUltimaFechaCobro] = useState(null);
  const [ahorro, setAhorro] = useState(0);
  const [historialAhorro, setHistorialAhorro] = useState([]);
  const [historialGastos, setHistorialGastos] = useState([]);
  const [saldoActual, setSaldoActual] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [validacionClass, setValidacionClass] = useState("");
  const [nuevoAhorro, setNuevoAhorro] = useState(0);
  const [nuevoGasto, setNuevoGasto] = useState(0);
  const [descGasto, setDescGasto] = useState("");

  const calcularSemanasRestantes = () => {
    try {
      const hoy = new Date();
      let fechaCobroInicial = null;

      if (ultimaFechaCobro) {
        fechaCobroInicial = new Date(ultimaFechaCobro);
      } else if (diaCobro) {
        fechaCobroInicial = new Date(hoy.getFullYear(), hoy.getMonth(), Number(diaCobro));
      }

      if (!fechaCobroInicial || isNaN(fechaCobroInicial.getTime())) return 1;

      const proximoCobro = new Date(hoy);
      proximoCobro.setMonth(hoy.getMonth() + (hoy.getDate() > Number(diaCobro) ? 1 : 0));
      proximoCobro.setDate(Number(diaCobro));

      const diffMs = proximoCobro - hoy;
      const semanas = Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 7));
      return semanas > 0 ? semanas : 0;
    } catch {
      return 1;
    }
  };

  const saldoSemanal = saldoActual / (calcularSemanasRestantes() || 1);

  useEffect(() => {
    const hoy = new Date();
    const hoyDia = hoy.getDate();
    if (Number(diaCobro) === hoyDia && sueldo > 0) {
      const sobrante = saldoActual;
      registrarAhorro(sobrante, "sumar");
      setSaldoActual(sueldo);
      setUltimaFechaCobro(new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()));
    }
  }, [diaCobro, sueldo]);

  const simularCobro = () => {
    const sobrante = saldoActual;
    registrarAhorro(sobrante, "sumar");
    setSaldoActual(sueldo);
    setUltimaFechaCobro(new Date());
  };

  const registrarAhorro = (monto, tipo) => {
    const montoNum = Number(monto);
    if (tipo === "sumar" && montoNum > saldoActual) {
      setFeedback("No hay saldo suficiente");
      setValidacionClass("animate-pulse bg-red-200 border border-red-500");
      return;
    }
    setFeedback("");
    setValidacionClass("animate-pulse bg-green-100 border-green-400");
    setTimeout(() => setValidacionClass(""), 500);
    const nuevoAhorroCalc = tipo === "sumar" ? ahorro + montoNum : ahorro - montoNum;
    setAhorro(nuevoAhorroCalc);
    setSaldoActual(tipo === "sumar" ? saldoActual - montoNum : saldoActual + montoNum);
    setHistorialAhorro([
      ...historialAhorro,
      {
        tipo: tipo === "sumar" ? "Ingreso" : "Extracción",
        monto: montoNum,
        fecha: new Date().toLocaleString(),
      },
    ]);
  };

  const eliminarAhorro = (index) => {
    const mov = historialAhorro[index];
    const nuevoHistorial = historialAhorro.filter((_, i) => i !== index);
    setHistorialAhorro(nuevoHistorial);
    setAhorro(mov.tipo === "Ingreso" ? ahorro - mov.monto : ahorro + mov.monto);
    setSaldoActual(mov.tipo === "Ingreso" ? saldoActual + mov.monto : saldoActual - mov.monto);
  };

  const registrarGasto = () => {
    const monto = parseFloat(nuevoGasto);
    if (isNaN(monto) || monto <= 0) return;
    if (monto > saldoActual) {
      setFeedback("Saldo insuficiente para registrar gasto");
      return;
    }
    setSaldoActual(saldoActual - monto);
    setHistorialGastos([
      ...historialGastos,
      { descripcion: descGasto || "Sin descripción", monto, fecha: new Date().toLocaleString() },
    ]);
    setNuevoGasto(0);
    setDescGasto("");
    setFeedback("");
  };

  const eliminarGasto = (index) => {
    const gasto = historialGastos[index];
    setSaldoActual(saldoActual + gasto.monto);
    setHistorialGastos(historialGastos.filter((_, i) => i !== index));
  };

  const colores = {
    miSaldo: "bg-green-500",
    ahorro: "bg-yellow-400",
    gastos: "bg-red-500",
    mas: "bg-blue-500",
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-black text-white relative p-4 font-sans">
      {pantalla === "index" && (
        <div className="grid grid-cols-2 gap-4 h-screen">
          <button onClick={() => setPantalla("miSaldo")} className={`${colores.miSaldo} rounded-xl p-6 text-black font-bold flex flex-col justify-center items-center`}>
            <Wallet size={40} />
            Mi Saldo
          </button>
          <button onClick={() => setPantalla("ahorro")} className={`${colores.ahorro} rounded-xl p-6 text-black font-bold flex flex-col justify-center items-center`}>
            <PiggyBank size={40} />
            Ahorros
          </button>
          <button onClick={() => setPantalla("gastos")} className={`${colores.gastos} rounded-xl p-6 text-black font-bold flex flex-col justify-center items-center`}>
            <List size={40} />
            Gastos
          </button>
          <button onClick={() => setPantalla("mas")} className={`${colores.mas} rounded-xl p-6 text-black font-bold flex flex-col justify-center items-center`}>
            <MoreHorizontal size={40} />
            Más
          </button>
        </div>
      )}

      {pantalla !== "index" && (
        <div className="mt-20 px-4">
          <button onClick={() => setPantalla("index")} className="absolute top-4 left-4 text-white">
            <ArrowLeft size={32} />
          </button>
          {pantalla === "miSaldo" && (
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-green-300">Mi Saldo</h2>
              <p>Saldo actual: ${saldoActual.toFixed(2)}</p>
              <input type="number" placeholder="Sueldo" value={sueldo} onChange={(e) => setSueldo(Number(e.target.value))} className="w-full p-2 text-black" />
              <input type="number" placeholder="Día de cobro" value={diaCobro} onChange={(e) => setDiaCobro(e.target.value)} className="w-full p-2 text-black" />
              <button onClick={simularCobro} className="bg-green-600 hover:bg-green-700 p-2 rounded text-white">Simular cobro</button>
            </div>
          )}

          {pantalla === "ahorro" && (
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-yellow-300">Ahorros</h2>
              <p>Ahorro total: ${ahorro.toFixed(2)}</p>
              <input type="number" value={nuevoAhorro} onChange={(e) => setNuevoAhorro(Number(e.target.value))} placeholder="Monto ahorro" className={`w-full p-2 text-black ${validacionClass}`} />
              <div className="flex gap-2">
                <button onClick={() => registrarAhorro(nuevoAhorro, "sumar")} className="bg-yellow-500 p-2 rounded">Sumar</button>
                <button onClick={() => registrarAhorro(nuevoAhorro, "restar")} className="bg-yellow-700 p-2 rounded">Restar</button>
              </div>
              {feedback && <p className="text-red-300">{feedback}</p>}
              <table className="w-full mt-4 bg-yellow-100 text-black">
                <thead><tr><th>Tipo</th><th>Monto</th><th>Fecha</th><th>Acción</th></tr></thead>
                <tbody>
                  {historialAhorro.map((mov, i) => (
                    <tr key={i} className="text-center">
                      <td>{mov.tipo}</td><td>${mov.monto}</td><td>{mov.fecha}</td>
                      <td><button onClick={() => eliminarAhorro(i)} className="text-red-600">Eliminar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pantalla === "gastos" && (
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-red-300">Gastos</h2>
              <p>Saldo disponible: ${saldoActual.toFixed(2)}</p>
              <input type="text" value={descGasto} onChange={(e) => setDescGasto(e.target.value)} placeholder="Motivo del gasto" className="w-full p-2 text-black" />
              <input type="number" value={nuevoGasto} onChange={(e) => setNuevoGasto(Number(e.target.value))} placeholder="Monto gasto" className="w-full p-2 text-black" />
              <button onClick={registrarGasto} className="bg-red-600 hover:bg-red-700 p-2 rounded text-white">Agregar gasto</button>
              {feedback && <p className="text-red-300">{feedback}</p>}
              <table className="w-full mt-4 bg-red-100 text-black">
                <thead><tr><th>Motivo</th><th>Monto</th><th>Fecha</th><th>Acción</th></tr></thead>
                <tbody>
                  {historialGastos.map((gasto, i) => (
                    <tr key={i} className="text-center">
                      <td>{gasto.descripcion}</td><td>${gasto.monto}</td><td>{gasto.fecha}</td>
                      <td><button onClick={() => eliminarGasto(i)} className="text-red-600">Eliminar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {pantalla === "mas" && (
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-blue-300">Más</h2>
              <p>Dinero semanal disponible: ${saldoSemanal.toFixed(2)}</p>
              <p>Semanas restantes hasta el cobro: {calcularSemanasRestantes()}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
