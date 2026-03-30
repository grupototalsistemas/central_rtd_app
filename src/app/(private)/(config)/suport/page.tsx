'use client';

import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Label from '@/components/form/Label';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import Button from '@/components/ui/button/Button';
import { RootState } from '@/store/rootReducer';
import { validateUserLoggedScreenLogout } from '@/utils/validateUserLogged/validateUserLoggedScreen';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function SuportePage() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [arquivos, setArquivos] = useState<File[]>([]);
  const { pessoa_usuario } = useSelector((state: RootState) => state.usuario);

  // useEffect(() => {
  //   const ensureValidUser = async () => {
  //     const parsedId = Number(pessoa_usuario?.id_pessoa_usuario || 0);
  //     await validateUserLoggedScreenLogout(parsedId);
  //   };

  //   ensureValidUser();
  // }, [pessoa_usuario?.id_pessoa_usuario]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      setArquivos((prev) => [...prev, ...Array.from(selectedFiles)]);
    }
  };

  const removeArquivo = (index: number) => {
    setArquivos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEnviar = () => {
    console.log({ titulo, descricao, arquivos });
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Suporte" pageBefore="configuracoes" />

      <ComponentCard title="Suporte para Desenvolvedores">
        <form className="space-y-6">
          <div>
            <Label>Titulo</Label>
            <Input
              type="text"
              placeholder="Descreva brevemente o problema"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div>
            <Label>Descricao</Label>
            <TextArea
              placeholder="Detalhe o problema encontrado"
              value={descricao}
              onChange={(value) => setDescricao(value)}
              rows={5}
            />
          </div>

          <div>
            <Label>Enviar Arquivos / Prints</Label>
            <div className="mt-2 rounded-lg border-2 border-dashed border-gray-300 p-4 text-center dark:border-gray-700">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="uploadInput"
              />
              <label
                htmlFor="uploadInput"
                className="cursor-pointer text-blue-600 hover:underline dark:text-blue-400"
              >
                Clique aqui para selecionar arquivos
              </label>
            </div>

            {arquivos.length > 0 && (
              <div className="mt-4 space-y-2">
                {arquivos.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm dark:border-gray-700"
                  >
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => removeArquivo(index)}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-right">
            <Button disabled size="md" variant="primary" onClick={handleEnviar}>
              Enviar Chamado de Suporte
            </Button>
          </div>
        </form>
      </ComponentCard>
    </>
  );
}
