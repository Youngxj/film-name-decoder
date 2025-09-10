#!/usr/bin/env node

/**
 * 本地部署脚本
 * 用于本地构建和打包静态文件
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, options = {}) {
  try {
    log(`执行: ${command}`, 'cyan');
    const result = execSync(command, { 
      cwd: rootDir, 
      stdio: 'inherit',
      ...options 
    });
    return result;
  } catch (error) {
    log(`命令执行失败: ${command}`, 'red');
    throw error;
  }
}

function createBuildInfo() {
  const buildInfo = {
    buildTime: new Date().toISOString(),
    version: getPackageVersion(),
    gitCommit: getGitCommit(),
    gitBranch: getGitBranch(),
    buildType: 'local',
    nodeVersion: process.version
  };

  const distDir = path.join(rootDir, 'dist');
  const buildInfoPath = path.join(distDir, 'build-info.json');
  
  fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
  log('构建信息已创建', 'green');
  
  return buildInfo;
}

function getPackageVersion() {
  try {
    const packagePath = path.join(rootDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    return packageJson.version;
  } catch {
    return 'unknown';
  }
}

function getGitCommit() {
  try {
    return execSync('git rev-parse HEAD', { cwd: rootDir, encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

function getGitBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { cwd: rootDir, encoding: 'utf8' }).trim();
  } catch {
    return 'unknown';
  }
}

function createArchives(buildInfo) {
  const distDir = path.join(rootDir, 'dist');
  const version = buildInfo.version;
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  
  log('创建压缩包...', 'yellow');
  
  // 创建 ZIP 压缩包
  try {
    const zipName = `film-name-decoder-v${version}-${timestamp}.zip`;
    execCommand(`cd dist && zip -r ../${zipName} .`);
    log(`✅ ZIP 压缩包已创建: ${zipName}`, 'green');
  } catch (error) {
    log('⚠️  ZIP 压缩包创建失败 (可能需要安装 zip 工具)', 'yellow');
  }
  
  // 创建 TAR.GZ 压缩包
  try {
    const tarName = `film-name-decoder-v${version}-${timestamp}.tar.gz`;
    execCommand(`cd dist && tar -czf ../${tarName} .`);
    log(`✅ TAR.GZ 压缩包已创建: ${tarName}`, 'green');
  } catch (error) {
    log('⚠️  TAR.GZ 压缩包创建失败', 'yellow');
  }
}

function showDeploymentInfo(buildInfo) {
  log('\n🎉 构建完成！', 'green');
  log('='.repeat(50), 'cyan');
  log(`📦 版本: ${buildInfo.version}`, 'blue');
  log(`🕒 构建时间: ${buildInfo.buildTime}`, 'blue');
  log(`🌿 Git 分支: ${buildInfo.gitBranch}`, 'blue');
  log(`📝 Git 提交: ${buildInfo.gitCommit.slice(0, 8)}`, 'blue');
  log('='.repeat(50), 'cyan');
  
  log('\n📁 部署说明:', 'yellow');
  log('1. 将 dist/ 目录中的所有文件上传到 Web 服务器', 'reset');
  log('2. 确保服务器支持静态文件访问', 'reset');
  log('3. 访问 index.html 即可使用', 'reset');
  
  log('\n📦 压缩包:', 'yellow');
  log('- 查看根目录中的 .zip 和 .tar.gz 文件', 'reset');
  log('- 可直接分发给用户使用', 'reset');
  
  log('\n🌐 本地预览:', 'yellow');
  log('npm run preview', 'cyan');
}

async function main() {
  try {
    log('🚀 开始构建影视文件名解析器...', 'bright');
    
    // 检查环境
    log('\n📋 检查环境...', 'yellow');
    log(`Node.js 版本: ${process.version}`, 'blue');
    
    // 安装依赖
    log('\n📦 安装依赖...', 'yellow');
    execCommand('npm ci');
    
    // 运行代码检查
    log('\n🔍 代码检查...', 'yellow');
    try {
      execCommand('npm run lint');
      log('✅ 代码检查通过', 'green');
    } catch (error) {
      log('⚠️  代码检查有警告，继续构建...', 'yellow');
    }
    
    // 构建项目
    log('\n🏗️  构建项目...', 'yellow');
    execCommand('npm run build');
    
    // 创建构建信息
    log('\n📝 创建构建信息...', 'yellow');
    const buildInfo = createBuildInfo();
    
    // 创建压缩包
    log('\n📦 创建压缩包...', 'yellow');
    createArchives(buildInfo);
    
    // 显示部署信息
    showDeploymentInfo(buildInfo);
    
  } catch (error) {
    log('\n❌ 构建失败！', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

// 运行脚本
main();