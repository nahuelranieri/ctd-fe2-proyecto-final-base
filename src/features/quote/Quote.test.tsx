import { rest } from "msw";
import { setupServer } from "msw/node";
import { screen, waitFor } from "@testing-library/react";
import Cita from "./Cita";
import { API_URL } from "../../app/constants";
import { render } from "../../test-util";
import userEvent from "@testing-library/user-event";

const data = [
  {
    quote: "I believe the children are the future... Unless we stop them now!",
    character: "Homer",
    image: "imagen",
    characterDirection: "right",
  },
];

export const handlers = [
  rest.get(API_URL, (req, res, ctx) => {
    return res(ctx.json(data), ctx.status(200), ctx.delay(150));
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe("Cita", () => {
  describe("Cuando renderizamos la home", () => {
    it("No deberia mostrar ninguna cita", async () => {
      render(<Cita />);

      expect(
        screen.getByText(/No se encontro ninguna cita/i)
      ).toBeInTheDocument();
    });
  });

  describe("Cuando la query se esta ejecutando", () => {
    it("Deberia mostrar el mensaje de cargando", async () => {
      render(<Cita />);

      const buttonSearch = await screen.findByLabelText(/Obtener Cita/i);
      userEvent.click(buttonSearch);
      await waitFor(() => {
        expect(screen.getByText(/cargando/i)).toBeInTheDocument();
      });
    });
  });

  describe("Cuando ingreso un nombre válido", () => {
    it("Deberia mostrar la cita del personaje", async () => {
      render(<Cita />);

      const input = screen.getByRole("textbox", { name: "Author Cita" });
      const buttonSearch = await screen.findByLabelText(/Obtener Cita/i);
      userEvent.click(input);
      userEvent.keyboard("homer");
      userEvent.click(buttonSearch);
      await waitFor(() => {
        expect(
          screen.getByText(
            /I believe the children are the future... Unless we stop them now!/i
          )
        ).toBeInTheDocument();
      });
    });
  });

  describe("Cuando ingreso un nombre inválido", () => {
    it("Deberia mostrar un mensaje de error", async () => {
      render(<Cita />);

      const input = screen.getByRole("textbox", { name: "Author Cita" });
      const buttonSearch = await screen.findByLabelText(/Obtener Cita/i);
      userEvent.click(input);
      userEvent.clear(input);
      userEvent.keyboard("homeroo");
      userEvent.click(buttonSearch);

      await waitFor(() => {
        expect(
          screen.getByText(/No se encontro ninguna cita/i)
        ).toBeInTheDocument();
      });
    });
  });
});
