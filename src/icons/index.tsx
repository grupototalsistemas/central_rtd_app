import AlertIcon from './alert.svg';
import AngleDownIcon from './angle-down.svg';
import AngleUpIcon from './angle-up.svg';
import ArrowDownIcon from './arrow-down.svg';
import ArrowLeftIcon from './arrow-left.svg';
import ArrowRightIcon from './arrow-right.svg';
import ArrowUpIcon from './arrow-up.svg';
import AudioIcon from './audio.svg';
import Banco from './banco.svg';
import BellIcon from './bell.svg';
import BoltIcon from './bolt.svg';
import BoxCubeIcon from './box-cube.svg';
import BoxIconLine from './box-line.svg';
import BoxIcon from './box.svg';
import Empresa from './building.svg';
import CalenderIcon from './calender-line.svg';
import Chamado from './chamado.svg';
import ChatIcon from './chat.svg';
import CheckCircleIcon from './check-circle.svg';
import CheckLineIcon from './check-line.svg';
import ChevronDownIcon from './chevron-down.svg';
import ChevronLeftIcon from './chevron-left.svg';
import ChevronUpIcon from './chevron-up.svg';
import CloseLineIcon from './close-line.svg';
import CloseIcon from './close.svg';
import Coin from './coin.svg';
import Compare from './compare.svg';
import Compress from './compress.svg';
import CopyIcon from './copy.svg';
import Currency from './currency.svg';
import DocsIcon from './docs.svg';
import DollarLineIcon from './dollar-line.svg';
import DownloadIcon from './download.svg';
import EnvelopeIcon from './envelope.svg';
import EyeCloseIcon from './eye-close.svg';
import EyeIcon from './eye.svg';
import FileIcon from './file.svg';
import Finance from './finance.svg';
import FolderIcon from './folder.svg';
import GridIcon from './grid.svg';
import GroupIcon from './group.svg';
import HorizontaLDots from './horizontal-dots.svg';
import ErrorIcon from './info-hexa.svg';
import InfoIcon from './info.svg';
import ListIcon from './list.svg';
import LockIcon from './lock.svg';
import MailIcon from './mail-line.svg';
import MoreDotIcon from './more-dot.svg';
import PageIcon from './page.svg';
import PaperPlaneIcon from './paper-plane.svg';
import Payments from './payments.svg';
import PencilIcon from './pencil.svg';
import PieChartIcon from './pie-chart.svg';
import PlugInIcon from './plug-in.svg';
import PlusIcon from './plus.svg';
import Print from './print.svg';
import Reload from './reaload.svg';
import Relatorio from './relatorio.svg';
import ReloadCalendar from './reload_calendar.svg';
import SearchIcon from './search.svg';
import Settings from './settings.svg';
import ShootingStarIcon from './shooting-star.svg';
import TableIcon from './table.svg';
import TaskIcon from './task-icon.svg';
import TimeIcon from './time.svg';
import TrashBinIcon from './trash.svg';
import TrendingDownIcon from './trendingDown.svg';
import TrendingUpIcon from './trendingUp.svg';
import UploadIcon from './upload.svg';
import UserCircleIcon from './user-circle.svg';
import UserIcon from './user-line.svg';
import VideoIcon from './videos.svg';
import XmlFolderIcon from './xml_folder.svg';

// Mapeamento de ícones por nome (string) para componentes React
export const mapaIcones: Record<string, React.ReactNode> = {
  // Ícones de alerta e status
  alert: <AlertIcon />,
  alerta: <AlertIcon />,
  error: <ErrorIcon />,
  erro: <ErrorIcon />,
  info: <InfoIcon />,
  informacao: <InfoIcon />,
  check: <CheckCircleIcon />,
  sucesso: <CheckCircleIcon />,
  checkline: <CheckLineIcon />,
  reload: <Reload />,

  // New Icons
  payments: <Payments />,
  currency: <Currency />,
  compare: <Compare />,
  compress: <Compress />,

  // Ícones de navegação e setas
  'angle-down': <AngleDownIcon />,
  'angle-up': <AngleUpIcon />,
  'arrow-down': <ArrowDownIcon />,
  'arrow-right': <ArrowRightIcon />,
  'arrow-up': <ArrowUpIcon />,
  'arrow-left': <ArrowLeftIcon />,
  'chevron-down': <ChevronDownIcon />,
  'chevron-left': <ChevronLeftIcon />,
  'chevron-up': <ChevronUpIcon />,

  // Ícones de fechamento
  close: <CloseIcon />,
  fechar: <CloseIcon />,
  'close-line': <CloseLineIcon />,

  // Ícones de mídia e arquivos
  audio: <AudioIcon />,
  video: <VideoIcon />,
  videos: <VideoIcon />,
  file: <FileIcon />,
  arquivo: <FileIcon />,
  folder: <FolderIcon />,
  pasta: <FolderIcon />,
  docs: <DocsIcon />,
  documentos: <DocsIcon />,
  page: <PageIcon />,
  pagina: <PageIcon />,
  print: <Print />,
  impressao: <Print />,

  // Ícones de usuário e grupo
  user: <UserIcon />,
  usuario: <UserIcon />,
  'user-circle': <UserCircleIcon />,
  'usuario-circulo': <UserCircleIcon />,
  group: <GroupIcon />,
  grupo: <GroupIcon />,

  // Ícones de comunicação
  bell: <BellIcon />,
  notificacao: <BellIcon />,
  chat: <ChatIcon />,
  conversa: <ChatIcon />,
  envelope: <EnvelopeIcon />,
  mail: <MailIcon />,
  email: <MailIcon />,
  'paper-plane': <PaperPlaneIcon />,
  enviar: <PaperPlaneIcon />,
  reloadCalendar: <ReloadCalendar />,

  // Ícones de ação
  plus: <PlusIcon />,
  adicionar: <PlusIcon />,
  pencil: <PencilIcon />,
  editar: <PencilIcon />,
  copy: <CopyIcon />,
  copiar: <CopyIcon />,
  download: <DownloadIcon />,
  baixar: <DownloadIcon />,
  upload: <UploadIcon />,
  envio: <UploadIcon />,
  search: <SearchIcon />,
  buscar: <SearchIcon />,
  trash: <TrashBinIcon />,
  lixo: <TrashBinIcon />,
  excluir: <TrashBinIcon />,

  // Ícones de visualização
  eye: <EyeIcon />,
  ver: <EyeIcon />,
  'eye-close': <EyeCloseIcon />,
  ocultar: <EyeCloseIcon />,
  grid: <GridIcon />,
  grade: <GridIcon />,
  list: <ListIcon />,
  lista: <ListIcon />,
  table: <TableIcon />,
  tabela: <TableIcon />,

  // Ícones específicos do sistema
  dashboard: <CalenderIcon />,
  painel: <CalenderIcon />,
  calendar: <CalenderIcon />,
  calendario: <CalenderIcon />,
  'pie-chart': <PieChartIcon />,
  grafico: <PieChartIcon />,
  box: <BoxIcon />,
  caixa: <BoxIcon />,
  'box-cube': <BoxCubeIcon />,
  cubo: <BoxCubeIcon />,
  'box-line': <BoxIconLine />,

  // Ícones de negócio
  empresa: <Empresa />,
  building: <Empresa />,
  predio: <Empresa />,
  chamado: <Chamado />,
  ticket: <Chamado />,
  task: <TaskIcon />,
  tarefa: <TaskIcon />,
  dollar: <DollarLineIcon />,
  dinheiro: <DollarLineIcon />,
  coin: <Coin />,
  time: <TimeIcon />,
  tempo: <TimeIcon />,
  bank: <Banco />,
  finance: <Finance />,
  relatorio: <Relatorio />,
  trendingUp: <TrendingUpIcon />,
  trendingDown: <TrendingDownIcon />,

  // Ícones de configuração
  'plug-in': <PlugInIcon />,
  plugin: <PlugInIcon />,
  configuracao: <PlugInIcon />,
  lock: <LockIcon />,
  bloqueio: <LockIcon />,
  seguranca: <LockIcon />,
  bolt: <BoltIcon />,
  energia: <BoltIcon />,
  settings: <Settings />,

  // Ícones especiais
  'more-dot': <MoreDotIcon />,
  mais: <MoreDotIcon />,
  'horizontal-dots': <HorizontaLDots />,
  pontos: <HorizontaLDots />,
  'shooting-star': <ShootingStarIcon />,
  estrela: <ShootingStarIcon />,

  // Ícone XML
  xml: <XmlFolderIcon />,
};

// Função utilitária para obter ícone por nome
export const obterIconePorNome = (nomeIcone: string): React.ReactNode => {
  const nomeNormalizado = nomeIcone.toLowerCase().trim();
  return mapaIcones[nomeNormalizado] || <BoxCubeIcon />; // Ícone padrão
};

// Função para verificar se um ícone existe no mapeamento
export const iconeExiste = (nomeIcone: string): boolean => {
  const nomeNormalizado = nomeIcone.toLowerCase().trim();
  return nomeNormalizado in mapaIcones;
};

// Função para obter todos os nomes de ícones disponíveis
export const obterNomesIconesDisponiveis = (): string[] => {
  return Object.keys(mapaIcones);
};

// Export individual dos ícones (mantido para compatibilidade)
export {
  AlertIcon,
  AngleDownIcon,
  AngleUpIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  AudioIcon,
  Banco,
  BellIcon,
  BoltIcon,
  BoxCubeIcon,
  BoxIcon,
  BoxIconLine,
  CalenderIcon,
  Chamado,
  ChatIcon,
  CheckCircleIcon,
  CheckLineIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronUpIcon,
  CloseIcon,
  CloseLineIcon,
  Coin,
  Compare,
  Compress,
  CopyIcon,
  Currency,
  DocsIcon,
  DollarLineIcon,
  DownloadIcon,
  Empresa,
  EnvelopeIcon,
  ErrorIcon,
  EyeCloseIcon,
  EyeIcon,
  FileIcon,
  Finance,
  FolderIcon,
  GridIcon,
  GroupIcon,
  HorizontaLDots,
  InfoIcon,
  ListIcon,
  LockIcon,
  MailIcon,
  MoreDotIcon,
  PageIcon,
  PaperPlaneIcon,
  Payments,
  PencilIcon,
  PieChartIcon,
  PlugInIcon,
  PlusIcon,
  Print,
  Relatorio,
  Reload,
  ReloadCalendar,
  SearchIcon,
  Settings,
  ShootingStarIcon,
  TableIcon,
  TaskIcon,
  TimeIcon,
  TrashBinIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  UploadIcon,
  UserCircleIcon,
  UserIcon,
  VideoIcon,
  XmlFolderIcon,
};
